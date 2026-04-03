import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

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

  private itemName(index = 0) {
    return this.cartItems.nth(index).locator('.inventory_item_name');
  }

  private removeItemBtn(itemName: string) {
    return this.page.locator(`.cart_item:has-text("${itemName}") [data-test^="remove"]`);
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async navigate() {
    await this.goto(ROUTES.cart);
  }

  async removeItem(itemName: string) {
    await this.removeItemBtn(itemName).click();
  }

  async proceedToCheckout() {
    await this.clickButton(this.checkoutButton);
    await this.assertUrl(/checkout-step-one/);
  }

  async continueShopping() {
    await this.continueButton.click();
    await this.assertUrl(/inventory/);
  }

  async getCartItemDetail(itemName: string): Promise<CartItemDetail> {
    const item = this.page.locator(`.cart_item:has-text("${itemName}")`);
    const name = (await item.locator('.inventory_item_name').textContent())!.trim();
    const desc = (await item.locator('.inventory_item_desc').textContent())!.trim();
    const priceText = (await item.locator('.inventory_item_price').textContent())!.trim();
    const price = parseFloat(priceText.replace('$', ''));
    const qty = parseInt((await item.locator('.cart_quantity').textContent())!, 10);
    return { name, desc, price, priceText, qty };
  }

  async assertProductMatchesInventory(
    cartItem: CartItemDetail,
    inventoryItem: { name: string; desc: string; price: number; priceText: string },
  ) {
    expect(cartItem.name, 'name mismatch').toBe(inventoryItem.name);
    expect(cartItem.desc, 'desc mismatch').toBe(inventoryItem.desc);
    expect(cartItem.price, 'price mismatch').toBe(inventoryItem.price);
    expect(cartItem.priceText, 'priceText mismatch').toBe(inventoryItem.priceText);
    expect(cartItem.qty, 'qty should be 1').toBe(1);
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
