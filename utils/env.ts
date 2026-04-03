// ─── Environment config ───────────────────────────────────────────────────────
// Usage:
//   TEST_ENV=prod    npx playwright test   → https://www.saucedemo.com
//   TEST_ENV=staging npx playwright test   → https://staging.saucedemo.com
//   TEST_ENV=dev     npx playwright test   → http://localhost:3000
//
// Default (no TEST_ENV set) → prod

const ENV_URLS: Record<string, string> = {
  prod: 'https://www.saucedemo.com',
  staging: 'https://staging.saucedemo.com',
  dev: 'http://localhost:3000',
};

export const CURRENT_ENV = process.env.TEST_ENV ?? 'prod';

if (!ENV_URLS[CURRENT_ENV]) {
  throw new Error(
    `Unknown TEST_ENV="${CURRENT_ENV}". Valid values: ${Object.keys(ENV_URLS).join(', ')}`,
  );
}

export const BASE_URL = ENV_URLS[CURRENT_ENV];
