import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Kaizen: stale Claude worktree directories (sibling working trees from
    // prior /tdd-harness or /ultraplan sessions) pollute lint with thousands
    // of false positives in .next/** build artifacts and unrelated old code.
    // They're not source — they're scratch space for past agent runs.
    ".claude/**",
    // Test coverage HTML report is generated artifact; not source.
    "coverage/**",
  ]),
]);

export default eslintConfig;
