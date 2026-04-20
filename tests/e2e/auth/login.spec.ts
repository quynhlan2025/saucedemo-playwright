import { expect as baseExpect } from '@playwright/test';
import { test } from '../../../fixtures';
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
    });

  const loginFailureCases = [
    {
      testId: 'TC-LOGIN-03',
      title: 'should show error for locked_out_user',
      username: USERS.locked.username,
      password: USERS.locked.password,
      errorPattern: /locked out/i,
    },
    {
      testId: 'TC-LOGIN-04',
      title: 'should show error for wrong credentials',
      username: 'bad_user',
      password: 'bad_pass',
      errorPattern: /username and password do not match/i,
    },
    {
      testId: 'TC-LOGIN-05',
      title: 'should show error when username is empty',
      username: '',
      password: USERS.standard.password,
      errorPattern: /username is required/i,
    },
    {
      testId: 'TC-LOGIN-06',
      title: 'should show error when password is empty',
      username: USERS.standard.username,
      password: '',
      errorPattern: /password is required/i,
    },
  ];

  for (const { testId, title, username, password, errorPattern } of loginFailureCases) {
    test(`[${testId}] ${title}`,
      { annotation: { type: 'testId', description: testId } },
      async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.loginExpectFailure(username, password);
        await loginPage.assertErrorMessage(errorPattern);
      });
  }
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
      await loginPage.assertErrorMessage(/locked out/i);

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
