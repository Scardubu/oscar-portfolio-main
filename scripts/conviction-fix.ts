import fs from "fs";

function fix(content: string) {
  // Replace inline motion with system variant
  content = content.replace(/initial=\{\{.*?\}\}/g, 'variants={reveal}');
  content = content.replace(/animate=\{\{.*?\}\}/g, 'animate="visible"');

  // Remove inline styles
  content = content.replaceAll(/style=\{\{.*?\}\}/g, "");

  return content;
}

const argv = (globalThis as { process?: { argv?: string[] } }).process?.argv;

if (!argv || argv.length < 3) {
  throw new Error("Missing file path argument.");
}

const file = argv[2];
const content = fs.readFileSync(file, "utf-8");

const updated = fix(content);

fs.writeFileSync(file, updated);

console.log(`✅ Fixed: ${file}`);
