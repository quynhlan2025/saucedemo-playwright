import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

export class LoginPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  readonly usernameInput = this.page.locator('[data-test="username"]');
  readonly passwordInput = this.page.locator('[data-test="password"]');
  readonly loginButton = this.page.locator('[data-test="login-button"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');
  readonly errorContainer = this.page.locator('.error-message-container');

  constructor(page: Page) {
    super(page);
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async navigate() {
    await this.goto(ROUTES.login);
  }

  async login(username: string, password: string) {
    await this.step('Fill login credentials', async () => {
      await this.fillField(this.usernameInput, username);
      await this.fillField(this.passwordInput, password);
    });
    await this.step('Click login button', async () => {
      await this.clickButton(this.loginButton);
    });
  }

  async loginExpectSuccess(username: string, password: string) {
    await this.step(`Login as "${username}" → expect redirect to inventory`, async () => {
      await this.login(username, password);
      await this.assertUrl(/\/inventory(\.html)?$/);
    });
  }

  async loginExpectFailure(username: string, password: string) {
    await this.step(`Login as "${username || '(empty)'}" → expect error message`, async () => {
      await this.login(username, password);
      await this.assertVisible(this.errorMessage);
    });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  async assertLoginFormVisible() {
    await this.step('Assert login form is visible', async () => {
      await this.assertVisible(this.usernameInput);
      await this.assertVisible(this.passwordInput);
      await this.assertVisible(this.loginButton);
    });
  }

  async assertErrorMessage(expected: string | RegExp) {
    await this.step(`Assert error message: ${expected}`, async () => {
      await this.assertVisible(this.errorMessage);
      await this.assertText(this.errorMessage, expected);
    });
  }

  async assertNoError() {
    await expect(this.errorContainer).not.toBeVisible();
  }
}
