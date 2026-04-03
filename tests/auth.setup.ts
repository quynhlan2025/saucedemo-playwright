import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../utils/constants';
import { STORAGE_STATE } from '../playwright.config';

/**
 * auth.setup.ts
 *
 * Runs ONCE before any test project.
 * Logs in as standard_user and saves the browser storage state to disk.
 * All subsequent tests load this state instead of logging in repeatedly.
 */
setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.loginExpectSuccess(USERS.standard.username, USERS.standard.password);

  // Verify we're on the inventory page before saving state
  // eslint-disable-next-line playwright/no-standalone-expect
  await expect(page).toHaveURL(/\/inventory(\.html)?$/);

  // 💾 Save cookies + localStorage → reused by all test projects
  await page.context().storageState({ path: STORAGE_STATE });
});
