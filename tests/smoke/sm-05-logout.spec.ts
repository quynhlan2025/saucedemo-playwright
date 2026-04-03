import { test, expect } from '../../fixtures';

/**
 * SM-05 — Security boundary — logout must truly block access.
 * Logout must invalidate the session — not just redirect visually.
 */
test.describe('[SM-05] Logout', { tag: '@smoke' }, () => {
  test(
    '[TC-SM-05-A] logout redirects user to login page',
    { annotation: { type: 'testId', description: 'TC-SM-05-A' } },
    async ({ inventoryPage }) => {
      await inventoryPage.navigate();
      await inventoryPage.logout();
      await expect(inventoryPage.page).toHaveURL('/');
    },
  );

  test(
    '[TC-SM-05-B] after logout, direct access to /inventory.html is blocked',
    { annotation: { type: 'testId', description: 'TC-SM-05-B' } },
    async ({ inventoryPage }) => {
      // Logout first
      await inventoryPage.navigate();
      await inventoryPage.logout();

      // Attempt direct navigation → must be redirected back to login
      await inventoryPage.page.goto('/inventory.html');
      await expect(inventoryPage.page).toHaveURL('/');
    },
  );

  test(
    '[TC-SM-05-C] after logout, login form is visible and ready',
    { annotation: { type: 'testId', description: 'TC-SM-05-C' } },
    async ({ inventoryPage, loginPage }) => {
      await inventoryPage.navigate();
      await inventoryPage.logout();
      await loginPage.assertLoginFormVisible();
    },
  );
});
