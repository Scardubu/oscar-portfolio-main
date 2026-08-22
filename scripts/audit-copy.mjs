import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const STRICT_NRS = process.argv.includes('--strict-nrs');

const RULES = [
  { pattern: /\bI\b(?!')/g, message: 'First-person "I" in rendered copy' },
  { pattern: /\bmy\b/gi, message: 'First-person "my" in rendered copy' },
  { pattern: /\bme\b/gi, message: 'First-person "me" in rendered copy' },
  { pattern: /24\/7/g, message: '"24/7" phrase found' },
  { pattern: /TODO|FIXME|PLACEHOLDER/g, message: 'Placeholder copy found' },
  {
    // Catch an arrow embedded mid-phrase (a char on both sides). This
    // deliberately ignores `=>` (arrow fns) and trailing CTA/flow arrows like
    // "Read case study →", which are an accepted idiom across the site.
    pattern: /[^=]→[^>]/g,
    message: "Text arrow found — use an icon, or the 'value → value' idiom",
    // Exempt the "value → value" transformation idiom — e.g. "4h → 15min",
    // "4h→15min", "Lagos → Global". Those arrows are transformational notation
    // (a measured before/after relationship), not a directional UI affordance,
    // so swapping in an icon would be semantically wrong.
    allow: /[\w%)\]]\s*→\s*[\w$([]/,
  },
  ...(STRICT_NRS ? [{ pattern: /\bFIRS\b/g, message: 'FIRS reference found — use NRS' }] : []),
];

// Evidence contract: these phrases were removed by the claim ledger and must
// not return through legacy data, RSS metadata, or machine-readable endpoints.
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
];

// Skip lines containing CSS class patterns (Tailwind utilities)
const CSS_CLASS_PATTERNS = [
  /\b(my-|mx-|p-|m-|gap-|pt-|pb-|pl-|pr-|px-|py-|mt-|mb-|ml-|mr-)/,
  /\b(w-|h-|text-|bg-|border-|rounded-|flex-|grid-)/,
  /\b(shadow-|opacity-|transition-|transform-)/,
];

// Skip URL patterns to avoid false positives on domain names like wa.me
const URL_PATTERNS = [/https?:\/\/[^\s]+/, /wa\.me/];

const SCAN_DIRS = ['app', 'components', 'lib', 'content'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.mdx']);
const SKIP_FILES = ['audit-copy.mjs', 'motionVariants.ts', 'github.ts', 'writing.ts', 'blog'];

let violations = 0;

// Strip comment spans so the rules scan rendered/source copy only — never code
// comments, where directional arrows and first-person notes are legitimate.
// Handles inline `//`, single- and multi-line `/* ... */` blocks, and JSX
// `{/* ... */}`. Multi-line block state carries across calls via `state.inBlock`.
// (Lines containing a URL are skipped earlier, so `//` inside `https://` is never
// reached here.)
function stripComments(line, state) {
  let result = '';
  let inBlock = state.inBlock;
  let i = 0;

  while (i < line.length) {
    if (inBlock) {
      const end = line.indexOf('*/', i);
      if (end === -1) {
        state.inBlock = true;
        return result;
      }
      inBlock = false;
      i = end + 2;
      continue;
    }

    if (line.startsWith('//', i)) {
      state.inBlock = false;
      return result;
    }

    if (line.startsWith('/*', i)) {
      inBlock = true;
      i += 2;
      continue;
    }

    result += line[i];
    i += 1;
  }

  state.inBlock = inBlock;
  return result;
}

async function scanFile(filePath) {
  const filename = path.basename(filePath);
  const content = await readFile(filePath, 'utf8');
  const lines = content.split('\n');

  for (const rule of CLAIM_RULES) {
    const state = { inBlock: false };

    for (let index = 0; index < lines.length; index += 1) {
      const code = stripComments(lines[index], state);
      if (!code.trim()) continue;

      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(code)) {
        console.error(`VIOLATION [${rule.message}]`);
        console.error(`  File: ${path.relative(ROOT, filePath)}:${index + 1}`);
        console.error(`  Line: ${lines[index].trim()}`);
        console.error('');
        violations += 1;
      }
      rule.pattern.lastIndex = 0;
    }
  }

  if (SKIP_FILES.some((item) => filename.includes(item))) return;

  // Skip blog directory (first-person narrative is intentional in posts)
  if (filePath.includes('/blog/') || filePath.includes('\\blog\\')) return;

  for (const rule of RULES) {
    // Block-comment state is per-rule because each rule re-scans every line.
    const state = { inBlock: false };

    for (let index = 0; index < lines.length; index += 1) {
      const rawLine = lines[index];
      const trimmed = rawLine.trim();

      // Markdown headings are not scanned (preserved from the original).
      if (!state.inBlock && trimmed.startsWith('#')) {
        continue;
      }

      const code = stripComments(rawLine, state);
      if (!code.trim()) {
        continue;
      }

      // Skip lines containing CSS class patterns (Tailwind utilities)
      if (CSS_CLASS_PATTERNS.some((pattern) => pattern.test(code))) {
        continue;
      }

      // Skip lines containing URL patterns
      if (URL_PATTERNS.some((pattern) => pattern.test(code))) {
        continue;
      }

      // Per-rule allow-list — exempts legitimate idioms (e.g. "value → value").
      if (rule.allow) {
        rule.allow.lastIndex = 0;
        if (rule.allow.test(code)) {
          continue;
        }
      }

      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(code)) {
        console.error(`VIOLATION [${rule.message}]`);
        console.error(`  File: ${path.relative(ROOT, filePath)}:${index + 1}`);
        console.error(`  Line: ${trimmed}`);
        console.error('');
        violations += 1;
      }

      rule.pattern.lastIndex = 0;
    }
  }
}

async function scanDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      await scanDir(fullPath);
      continue;
    }

    if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      await scanFile(fullPath);
    }
  }
}

for (const dir of SCAN_DIRS) {
  await scanDir(path.join(ROOT, dir));
}

if (violations > 0) {
  console.error(`audit:copy — ${violations} violation(s) found. Fix before pushing.`);
  process.exit(1);
}

console.log(`audit:copy — clean (${STRICT_NRS ? '--strict-nrs mode' : 'standard mode'})`);
