import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { BASE_URL, CURRENT_ENV } from './utils/env';
import killPort from './utils/killPort';

// Path to store the authenticated browser state
export const STORAGE_STATE = path.join(__dirname, 'auth/user.json');

console.log(`\n🌍  Running on env: [${CURRENT_ENV.toUpperCase()}]  →  ${BASE_URL}\n`);

export default defineConfig({
  globalSetup: './utils/killPort',
  globalTeardown: './utils/openReport',
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],

  use: {
    baseURL: BASE_URL,
    headless: !!process.env.CI,
    launchOptions: {
      slowMo: process.env.CI ? 0 : 800,
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ── 1. Setup project: runs ONCE, saves auth state ──────────────────
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // ── 2. Main tests: depend on setup, reuse saved state ──────────────
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE, // ← reuse logged-in session
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    // {
    //   name: 'mobile-chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //     storageState: STORAGE_STATE,
    //   },
    //   dependencies: ['setup'],
    // },
  ],
});
