import { existsSync } from 'node:fs';

const required = ['app/layout.tsx', 'app/page.tsx'];

for (const file of required) {
  if (!existsSync(file)) {
    console.error(`Missing required App Router file: ${file}`);
    process.exit(1);
  }
}
