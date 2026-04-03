import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — inherited by all Page Objects.
 * Provides shared helpers so child classes stay DRY.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  async goto(path = '') {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  async assertUrl(expected: string | RegExp) {
    const currentUrl = this.page.url();

    if (expected instanceof RegExp) {
      expect(currentUrl).toMatch(expected);
    } else {
      expect(currentUrl).toContain(expected);
    }
  }

  async assertTitle(expected: string | RegExp) {
    await expect(this.page).toHaveTitle(expected);
  }

  async assertVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async assertText(locator: Locator, text: string | RegExp) {
    await expect(locator).toHaveText(text);
  }

  // ── Wait helpers ───────────────────────────────────────────────────────────
  /**
   * Wait for a locator to be visible and enabled before interacting.
   * Default timeout: 10s.
   */
  async waitReady(locator: Locator, timeout = 10_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

  // ── Interactions ───────────────────────────────────────────────────────────
  async highlight(locator: Locator, durationMs = 500, color: 'red' | 'blue' = 'red') {
    const styles =
      color === 'blue'
        ? { outline: '3px solid #3399ff', boxShadow: '0 0 12px 4px rgba(51,153,255,0.7)', bg: 'rgba(51,153,255,0.08)' }
        : { outline: '3px solid #ff3333', boxShadow: '0 0 12px 4px rgba(255,51,51,0.7)',  bg: 'rgba(255,51,51,0.15)' };

    await locator.evaluate((el, s) => {
      const e = el as HTMLElement;
      e.style.outline = s.outline;
      e.style.boxShadow = s.boxShadow;
      e.style.backgroundColor = s.bg;
      e.style.transition = 'all 0.15s ease';
    }, styles);
    await this.page.waitForTimeout(durationMs);
    await locator.evaluate(el => {
      const e = el as HTMLElement;
      e.style.outline = '';
      e.style.boxShadow = '';
      e.style.backgroundColor = '';
      e.style.transition = '';
    });
  }

  /**
   * Wait for element → highlight → click.
   */
  async clickButton(locator: Locator) {
    await this.waitReady(locator);
    await this.highlight(locator);
    await locator.click();
  }

  /**
   * Wait for element → highlight → clear → fill value.
   */
  async fillField(locator: Locator, value: string) {
    await this.waitReady(locator);
    await this.highlight(locator, 400, 'blue');
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Wait for element → type text character by character (simulates real keyboard input).
   * Useful for inputs that react to keystrokes (autocomplete, masked inputs).
   */
  async sendKeys(locator: Locator, value: string, delay = 50) {
    await this.waitReady(locator);
    await locator.clear();
    await locator.pressSequentially(value, { delay });
  }

  /**
   * Wait for element → press a single key (e.g. 'Enter', 'Tab', 'Escape').
   */
  async pressKey(locator: Locator, key: string) {
    await this.waitReady(locator);
    await locator.press(key);
  }

  // ── Screenshot helper ──────────────────────────────────────────────────────
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `./screenshots/${name}.png`, fullPage: true });
  }
}
