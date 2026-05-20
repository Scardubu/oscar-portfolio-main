/// <reference types="node" />

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// Directories scanned when no explicit file list is provided (whole-tree mode).
const INCLUDED_DIRECTORIES = ['app', 'components', 'constants', 'hooks', 'lib'];

// When lint-staged passes specific files, only check design-system directories.
// Test directories (e2e, tests) use TypeScript/Playwright — not Tailwind — so the
// inline-style and arbitrary-value checks produce false positives there.
const DESIGN_SYSTEM_DIRECTORIES = new Set<string>([
  'app',
  'components',
  'constants',
  'hooks',
  'lib',
]);

const IGNORED_DIRECTORIES = new Set<string>([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);
const SUPPORTED_EXTENSIONS = new Set<string>(['.ts', '.tsx', '.mjs']);

function isSupportedFile(filePath: string): boolean {
  return SUPPORTED_EXTENSIONS.has(path.extname(filePath));
}

function isDesignSystemFile(filePath: string): boolean {
  const relative = path.relative(ROOT, filePath);
  const topLevel = relative.split(path.sep)[0];
  return DESIGN_SYSTEM_DIRECTORIES.has(topLevel);
}

function normalizeFilePath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.resolve(ROOT, filePath);
}

function scanFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues: string[] = [];

  if (content.includes('style={{')) {
    issues.push('Inline styles detected');
  }

  // Match actual Tailwind arbitrary-value syntax: prefix-[value] e.g. text-[14px], w-[100px].
  // The pattern requires a word-prefix before the brackets to avoid matching TypeScript
  // array syntax, Playwright attribute selectors, and other non-Tailwind brackets.
  if (/\b\w+(?:-\w+)*-\[[^\]]+\]/.test(content)) {
    issues.push('Arbitrary Tailwind values detected');
  }

  // Only flag Framer Motion inline objects in JSX component files (.tsx).
  // Plain .ts files (utilities, hooks) may legitimately reference these strings in types.
  if (
    path.extname(filePath) === '.tsx' &&
    (content.includes('initial={{') ||
      content.includes('animate={{') ||
      content.includes('exit={{'))
  ) {
    issues.push('Inline motion detected');
  }

  return issues;
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry: fs.Dirent): string[] => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        return [];
      }

      return walk(fullPath);
    }

    return isSupportedFile(fullPath) ? [fullPath] : [];
  });
}

function collectCandidateFiles(): string[] {
  const providedFiles = process.argv
    .slice(2)
    .map(normalizeFilePath)
    .filter((filePath: string): boolean => {
      return (
        fs.existsSync(filePath) &&
        fs.statSync(filePath).isFile() &&
        isSupportedFile(filePath) &&
        isDesignSystemFile(filePath)
      );
    });

  if (providedFiles.length > 0) {
    return providedFiles;
  }

  return INCLUDED_DIRECTORIES.map((directory: string): string => path.join(ROOT, directory))
    .filter(
      (directory: string): boolean =>
        fs.existsSync(directory) && fs.statSync(directory).isDirectory()
    )
    .flatMap((directory: string): string[] => walk(directory));
}

const files = Array.from(new Set<string>(collectCandidateFiles()));
let hasIssues = false;

for (const file of files) {
  const issues = scanFile(file);

  if (issues.length === 0) {
    continue;
  }

  hasIssues = true;
  process.stderr.write(`\n❌ ${path.relative(ROOT, file)}\n`);

  for (const issue of issues) {
    process.stderr.write(`  - ${issue}\n`);
  }
}

if (hasIssues) {
  process.exit(1);
}

process.stdout.write(`✅ No conviction violations in ${files.length} file${files.length === 1 ? '' : 's'}\n`);
