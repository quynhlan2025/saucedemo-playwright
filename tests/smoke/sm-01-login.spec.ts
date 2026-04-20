import { test, expect } from '../../fixtures';
import { USERS } from '../../utils/constants';

/**
 * SM-01 — App cannot be used if login is broken.
 * If this fails → nothing else matters, entire app is inaccessible.
 */
test.describe('[SM-01] Login', { tag: '@smoke' }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test(
    '[TC-SM-01-A] login form renders on landing page',
    { annotation: { type: 'testId', description: 'TC-SM-01-A' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.assertLoginFormVisible();
    },
  );

  test(
    '[TC-SM-01-B] standard_user logs in → redirected to inventory',
    { annotation: { type: 'testId', description: 'TC-SM-01-B' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginExpectSuccess(USERS.standard.username, USERS.standard.password);
    },
  );

  test(
    '[TC-SM-01-C] locked_out_user is blocked → error shown → URL stays at /',
    { annotation: { type: 'testId', description: 'TC-SM-01-C' } },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.login(USERS.locked.username, USERS.locked.password);

      await loginPage.assertErrorMessage(/locked out/i);
      await expect(loginPage.page).toHaveURL('/');
    },
  );
});
