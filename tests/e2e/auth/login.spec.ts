import { test as base, expect as baseExpect } from '@playwright/test';
import { test, expect } from '../../../fixtures';
import { USERS } from '../../../utils/constants';

// ─── Tests that need a fresh (unauthenticated) session ───────────────────────
test.describe('Login — unauthenticated', { tag: '@regression' }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('[TC-LOGIN-01] should show login form on landing',
    { annotation: { type: 'testId', description: 'TC-LOGIN-01' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.assertLoginFormVisible();
    });

  test('[TC-LOGIN-02] should login successfully with standard_user',
    { annotation: { type: 'testId', description: 'TC-LOGIN-02' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginExpectSuccess(
        USERS.standard.username,
        USERS.standard.password,
      );
      await loginPage.assertUrl('inventory');
    });

  test('[TC-LOGIN-03] should show error for locked_out_user',
    { annotation: { type: 'testId', description: 'TC-LOGIN-03' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginExpectFailure(
        USERS.locked.username,
        USERS.locked.password,
      );
      await loginPage.assertErrorMessage(/locked out/i);
    });

  test('[TC-LOGIN-04] should show error for wrong credentials',
    { annotation: { type: 'testId', description: 'TC-LOGIN-04' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginExpectFailure('bad_user', 'bad_pass');
      await loginPage.assertErrorMessage(/username and password do not match/i);
    });

  test('[TC-LOGIN-05] should show error when username is empty',
    { annotation: { type: 'testId', description: 'TC-LOGIN-05' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginExpectFailure('', USERS.standard.password);
      await loginPage.assertErrorMessage(/username is required/i);
    });

  test('[TC-LOGIN-06] should show error when password is empty',
    { annotation: { type: 'testId', description: 'TC-LOGIN-06' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginExpectFailure(USERS.standard.username, '');
      await loginPage.assertErrorMessage(/password is required/i);
    });
});

// ─── Locked-out user ─────────────────────────────────────────────────────────
test.describe('Login — locked_out_user', { tag: '@regression' }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('[TC-LOGIN-07] should block login, show correct error, and prevent access to inventory',
    { annotation: { type: 'testId', description: 'TC-LOGIN-07' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login(USERS.locked.username, USERS.locked.password);

      // Assert 1: error message displays correct content
      await loginPage.assertErrorMessage('Epic sadface: Sorry, this user has been locked out.');

      // Assert 2: URL stays at "/" → not redirected to inventory
      await baseExpect(loginPage.page).toHaveURL('/');

      // Assert 3: attempt direct navigation to /inventory.html → redirected back to "/" immediately
      await loginPage.page.goto('/inventory.html');
      await baseExpect(loginPage.page).toHaveURL('/');
    });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
test.describe('Logout — authenticated', { tag: '@regression' }, () => {
  test('[TC-LOGIN-08] should logout successfully',
    { annotation: { type: 'testId', description: 'TC-LOGIN-08' } },
    async ({ inventoryPage }) => {
      await inventoryPage.navigate();
      await inventoryPage.logout();
      await baseExpect(inventoryPage.page).toHaveURL('/');
    });
});
