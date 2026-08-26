import { readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Copy and Claims Audit Validation', () => {
  const rootDir = resolve(__dirname, '../..');

  const RULES = [
    { pattern: /\bI\b(?!')/g, message: 'First-person "I" in rendered copy' },
    { pattern: /\bmy\b/gi, message: 'First-person "my" in rendered copy' },
    { pattern: /\bme\b/gi, message: 'First-person "me" in rendered copy' },
    { pattern: /24\/7/g, message: '"24/7" phrase found' },
    { pattern: /TODO|FIXME|PLACEHOLDER/g, message: 'Placeholder copy found' },
    { pattern: /\bFIRS\b/g, message: 'FIRS reference found — use NRS' },
  ];

  const CLAIM_RULES = [
    { pattern: /99\.9(?:4)?%/gi, message: 'Unlinked uptime claim found' },
    { pattern: /45%\s+MTTD/gi, message: 'Unlinked MTTD claim found' },
    { pattern: /\bsub[- ]?150ms\b/gi, message: 'Unlinked latency claim found' },
    { pattern: /95%\s+test coverage/gi, message: 'Unlinked coverage claim found' },
    { pattern: /\bzero(?:-| )?(?:data loss|drop)\b/gi, message: 'Unbounded data-loss claim found' },
    { pattern: /40 million(?: Nigerian)? (?:students|children)/gi, message: 'Unsupported population claim found' },
    { pattern: /15\+\s+merged contributions/gi, message: 'Unlinked contribution-count claim found' },
    { pattern: /\bNDPC\s+(?:compliance|compliant)\b/gi, message: 'Unsupported compliance claim found' },
    { pattern: /(?:respond|responds|response)[^\n]{0,24}within 24 hours/gi, message: 'Unsustainable response-time promise found' },
    { pattern: /350\+\s+international users/gi, message: 'Unsupported user-count claim found' },
    { pattern: /\$3k\+?\s+MRR/gi, message: 'Unsupported revenue claim found' },
    { pattern: /mathematically invisible/gi, message: 'Absolute tenant-isolation outcome claim found' },
    { pattern: /(?:edit|change)[^\n]{0,28}breaks?[^\n]{0,12}instantly/gi, message: 'Absolute audit-chain detection claim found' },
    { pattern: /incident triage in minutes(?:,|\s)+not hours/gi, message: 'Unmeasured incident-triage time claim found' },
    { pattern: /\bzero cloud egress\b/gi, message: 'Unbounded cloud-egress claim found' },
    { pattern: /\bproduction-hardened packages\b/gi, message: 'Unqualified OSS production-hardening claim found' },
    { pattern: /\ball packages are publicly auditable\b/gi, message: 'Overbroad public-auditability claim found' },
  ];

  const CSS_CLASS_PATTERNS = [
    /\b(my-|mx-|p-|m-|gap-|pt-|pb-|pl-|pr-|px-|py-|mt-|mb-|ml-|mr-)/,
    /\b(w-|h-|text-|bg-|border-|rounded-|flex-|grid-)/,
    /\b(shadow-|opacity-|transition-|transform-)/,
  ];

  const URL_PATTERNS = [/https?:\/\/[^\s]+/, /wa\.me/];
  const SCAN_DIRS = ['app', 'components', 'lib', 'content'];
  const EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.mdx']);
  const SKIP_FILES = ['audit-copy.mjs', 'motionVariants.ts', 'github.ts', 'writing.ts', 'blog'];

  async function getFiles(dir: string): Promise<string[]> {
    const fullPath = join(rootDir, dir);
    const dirents = await readdir(fullPath, { withFileTypes: true });
    const files: string[] = [];

    for (const d of dirents) {
      const res = join(dir, d.name);
      if (d.isDirectory()) {
        if (!d.name.startsWith('.') && d.name !== 'node_modules') {
          files.push(...(await getFiles(res)));
        }
      } else if (EXTENSIONS.has(extname(d.name))) {
        files.push(res);
      }
    }
    return files;
  }

  function isCodeOrComment(line: string): boolean {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return true;
    if (trimmed.startsWith('import ') || trimmed.startsWith('export ') || trimmed.startsWith('const ')) return true;
    return false;
  }

  it('verifies zero copy violations and zero unverified claim violations', async () => {
    const violations: string[] = [];

    for (const scanDir of SCAN_DIRS) {
      const files = await getFiles(scanDir);

      for (const relPath of files) {
        if (SKIP_FILES.some((s) => relPath.includes(s))) continue;

        const content = await readFile(join(rootDir, relPath), 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, i) => {
          const lineNum = i + 1;

          for (const rule of RULES) {
            rule.pattern.lastIndex = 0;
            if (rule.pattern.test(line)) {
              if (URL_PATTERNS.some((p) => p.test(line))) continue;
              if (rule.pattern.source.includes('\\bI\\b') && isCodeOrComment(line)) continue;
              if (
                rule.pattern.source.includes('\\bmy\\b') &&
                (CSS_CLASS_PATTERNS.some((p) => p.test(line)) || line.includes('my-'))
              ) {
                continue;
              }
              if (
                rule.pattern.source.includes('\\bme\\b') &&
                (isCodeOrComment(line) || CSS_CLASS_PATTERNS.some((p) => p.test(line)))
              ) {
                continue;
              }
              violations.push(`${relPath}:${lineNum} — ${rule.message}: "${line.trim()}"`);
            }
            rule.pattern.lastIndex = 0;
          }

          for (const rule of CLAIM_RULES) {
            rule.pattern.lastIndex = 0;
            if (rule.pattern.test(line)) {
              violations.push(`${relPath}:${lineNum} — ${rule.message}: "${line.trim()}"`);
            }
            rule.pattern.lastIndex = 0;
          }
        });
      }
    }

    expect(violations).toEqual([]);
  });
});
