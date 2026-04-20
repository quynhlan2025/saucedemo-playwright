import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, parseCurrency } from '../utils/constants';

export type CartItemDetail = {
  name: string;
  desc: string;
  price: number;
  priceText: string;
  qty: number;
};

export class CartPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  readonly cartItems = this.page.locator('.cart_item');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  readonly continueButton = this.page.locator('[data-test="continue-shopping"]');

  constructor(page: Page) {
    super(page);
  }

  private removeItemBtn(itemName: string) {
    return this.page.locator(`.cart_item:has-text("${itemName}") [data-test^="remove"]`);
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async navigate() {
    await this.goto(ROUTES.cart);
  }

  async removeItem(itemName: string) {
    await this.step(`Remove "${itemName}" from cart`, async () => {
      await this.removeItemBtn(itemName).click();
    });
  }

  async proceedToCheckout() {
    await this.step('Proceed to checkout', async () => {
      await this.clickButton(this.checkoutButton);
      await this.assertUrl(/checkout-step-one/);
    });
  }

  async continueShopping() {
    await this.step('Continue shopping → back to inventory', async () => {
      await this.continueButton.click();
      await this.assertUrl(/inventory/);
    });
  }

  async getCartItemDetail(itemName: string): Promise<CartItemDetail> {
    const item = this.page.locator(`.cart_item:has-text("${itemName}")`);
    const name = await this.getText(item.locator('.inventory_item_name'));
    const desc = await this.getText(item.locator('.inventory_item_desc'));
    const priceText = await this.getText(item.locator('.inventory_item_price'));
    const price = parseCurrency(priceText);
    const qty = parseInt(await this.getText(item.locator('.cart_quantity')), 10);
    return { name, desc, price, priceText, qty };
  }

  async assertProductMatchesInventory(
    cartItem: CartItemDetail,
    inventoryItem: { name: string; desc: string; price: number; priceText: string },
  ) {
    await this.step(`Assert cart matches inventory: "${inventoryItem.name}"`, async () => {
      expect.soft(cartItem.name, 'name mismatch').toBe(inventoryItem.name);
      expect.soft(cartItem.desc, 'desc mismatch').toBe(inventoryItem.desc);
      expect.soft(cartItem.price, 'price mismatch').toBe(inventoryItem.price);
      expect.soft(cartItem.priceText, 'priceText mismatch').toBe(inventoryItem.priceText);
      expect.soft(cartItem.qty, 'qty should be 1').toBe(1);
    });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  async assertCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async assertItemInCart(itemName: string) {
    await expect(this.page.locator(`.cart_item:has-text("${itemName}")`)).toBeVisible();
  }

  async assertItemNotInCart(itemName: string) {
    await expect(this.page.locator(`.cart_item:has-text("${itemName}")`)).not.toBeVisible();
  }
}
