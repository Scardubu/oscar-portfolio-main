import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "docs/**",
      "next-env.d.ts",
      "node_modules/**",
      "public/**",
      "scripts/**",
      "app/components/Skills/**",
      "components/BentoFeaturedProjects.tsx",
      "components/BentoMetric.tsx",
      "components/ContactForm.tsx",
      "components/Hero.tsx",
      "components/LiquidGlassSkillsMap.tsx",
      "components/LiveActivity.tsx",
      "components/NavigationBar.tsx",
      "components/Testimonials.tsx",
      "components/layout/**",
      "components/sections/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
