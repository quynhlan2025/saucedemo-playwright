import { test as setup, expect } from '@playwright/test';
import { authenticateViaApi } from '../api/authApi';
import { USERS } from '../test-data/users';
import { STORAGE_STATE } from '../playwright.config';

/**
 * auth.setup.ts
 *
 * Runs ONCE before any test project.
 * Injects the session cookie via API (no UI interaction) then verifies
 * the protected route is accessible before saving storage state to disk.
 * All subsequent tests load this state instead of authenticating repeatedly.
 */
setup('authenticate as standard_user via API', async ({ page }) => {
  await authenticateViaApi(page.context(), USERS.standard.username);

  // Verify the injected session grants access to the protected route
  await page.goto('/inventory.html');
  // eslint-disable-next-line playwright/no-standalone-expect
  await expect(page).toHaveURL(/\/inventory(\.html)?$/);

  // Save cookies → reused by all test projects
  await page.context().storageState({ path: STORAGE_STATE });
});
