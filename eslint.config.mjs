import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default [
  // ── TypeScript base rules ─────────────────────────────────────────────────
  ...tseslint.configs.recommended,

  // ── Playwright-specific rules (applied to test files only) ────────────────
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-focused-test': 'error',      // forbid test.only
      'playwright/no-skipped-test': 'warn',       // warn on test.skip
      'playwright/valid-expect': 'error',         // expect() must have assertion
      'playwright/no-wait-for-timeout': 'warn',   // prefer explicit waits
      'playwright/expect-expect': 'off',          // allow helper-only tests
      'playwright/no-commented-out-tests': 'warn',// warn on commented-out tests
    },
  },

  // ── Global TypeScript rules ───────────────────────────────────────────────
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },

  // ── Disable ESLint rules that conflict with Prettier ─────────────────────
  prettier,

  // ── Ignored paths ─────────────────────────────────────────────────────────
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'auth/**',
    ],
  },
];
