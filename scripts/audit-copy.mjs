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
  { pattern: /[^=]→[^>]/g, message: 'Text arrow found — use an icon instead' },
  ...(STRICT_NRS ? [{ pattern: /\bFIRS\b/g, message: 'FIRS reference found — use NRS' }] : []),
];

// Skip lines containing CSS class patterns (Tailwind utilities)
const CSS_CLASS_PATTERNS = [
  /\b(my-|mx-|p-|m-|gap-|pt-|pb-|pl-|pr-|px-|py-|mt-|mb-|ml-|mr-)/,
  /\b(w-|h-|text-|bg-|border-|rounded-|flex-|grid-)/,
  /\b(shadow-|opacity-|transition-|transform-)/,
];

// Skip URL patterns to avoid false positives on domain names like wa.me
const URL_PATTERNS = [
  /https?:\/\/[^\s]+/,
  /wa\.me/,
];

const SCAN_DIRS = ['app', 'components', 'lib', 'content'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.mdx']);
const SKIP_FILES = ['audit-copy.mjs', 'motionVariants.ts', 'github.ts', 'writing.ts', 'blog'];

let violations = 0;

async function scanFile(filePath) {
  const filename = path.basename(filePath);
  if (SKIP_FILES.some((item) => filename.includes(item))) {
    return;
  }
  // Skip blog directory (first-person narrative is intentional in posts)
  if (filePath.includes('/blog/') || filePath.includes('\\blog\\')) {
    return;
  }

  const content = await readFile(filePath, 'utf8');
  const lines = content.split('\n');

  for (const rule of RULES) {
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const trimmed = line.trim();

      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#')) {
        continue;
      }

      // Skip lines containing CSS class patterns
      if (CSS_CLASS_PATTERNS.some((pattern) => pattern.test(line))) {
        continue;
      }

      // Skip lines containing URL patterns
      if (URL_PATTERNS.some((pattern) => pattern.test(line))) {
        continue;
      }

      if (rule.pattern.test(line)) {
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
