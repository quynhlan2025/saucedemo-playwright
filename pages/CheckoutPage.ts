import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage extends BasePage {
  // ── Locators — Step One (customer info) ───────────────────────────────────
  readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  readonly continueButton = this.page.locator('[data-test="continue"]');
  readonly cancelButton = this.page.locator('[data-test="cancel"]');

  // ── Locators — Step Two (order summary) ───────────────────────────────────
  readonly summaryTotal = this.page.locator('.summary_total_label');
  readonly summarySubtotal = this.page.locator('.summary_subtotal_label');
  readonly summaryTax = this.page.locator('.summary_tax_label');
  readonly finishButton = this.page.locator('[data-test="finish"]');
  readonly cartItems = this.page.locator('.cart_item');

  // ── Locators — Complete ────────────────────────────────────────────────────
  readonly confirmationHeader = this.page.locator('.complete-header');
  readonly confirmationText = this.page.locator('.complete-text');

  constructor(page: Page) {
    super(page);
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async navigate() {
    await this.goto(ROUTES.checkout);
  }

  async fillCustomerInfo(customer: CustomerInfo) {
    await this.step('Fill customer info', async () => {
      await this.fillField(this.firstNameInput, customer.firstName);
      await this.fillField(this.lastNameInput, customer.lastName);
      await this.fillField(this.postalCodeInput, customer.postalCode);
    });
  }

  async continue() {
    await this.step('Click continue', async () => {
      await this.clickButton(this.continueButton);
      await this.assertUrl(/checkout-step-two/);
    });
  }

  async fillCustomerInfoAndContinue(customer: CustomerInfo) {
    await this.fillCustomerInfo(customer);
    await this.continue();
  }

  async finish() {
    await this.step('Click finish and confirm order', async () => {
      await this.clickButton(this.finishButton);
      await this.assertUrl(/checkout-complete/);
    });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  async assertOrderSummaryContains(productName: string) {
    await this.step(`Assert order summary contains "${productName}"`, async () => {
      await expect(this.cartItems).toContainText(productName);
      await this.assertVisible(this.summaryTotal);
    });
  }

  async assertOrderConfirmed() {
    await this.step('Assert order confirmation page', async () => {
      await this.assertUrl(/checkout-complete/);
      await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
    });
  }
}
