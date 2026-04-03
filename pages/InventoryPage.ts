import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

export class InventoryPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  readonly pageTitle = this.page.locator('.title');
  readonly inventoryList = this.page.locator('.inventory_list');
  readonly inventoryItems = this.page.locator('.inventory_item');
  readonly cartBadge = this.page.locator('.shopping_cart_badge');
  readonly cartLink = this.page.locator('.shopping_cart_link');
  readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  readonly menuButton = this.page.locator('#react-burger-menu-btn');
  readonly logoutLink = this.page.locator('#logout_sidebar_link');

  constructor(page: Page) {
    super(page);
  }

  // ── Selectors by item name ─────────────────────────────────────────────────
  private addToCartBtn(itemName: string) {
    return this.page
      .locator(`.inventory_item:has-text("${itemName}") button`)
      .filter({ hasText: /add to cart/i });
  }

  private removeBtn(itemName: string) {
    return this.page
      .locator(`.inventory_item:has-text("${itemName}") button`)
      .filter({ hasText: /remove/i });
  }

  private itemPrice(itemName: string) {
    return this.page.locator(`.inventory_item:has-text("${itemName}") .inventory_item_price`);
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async navigate() {
    await this.goto(ROUTES.inventory);
  }

  async pickRandom(): Promise<{ name: string; desc: string; price: number; priceText: string }> {
    const count = await this.inventoryItems.count();
    const index = Math.floor(Math.random() * count);
    const item = this.inventoryItems.nth(index);

    const name = (await item.locator('.inventory_item_name').textContent())!.trim();
    const desc = (await item.locator('.inventory_item_desc').textContent())!.trim();
    const priceText = (await item.locator('.inventory_item_price').textContent())!.trim();
    const price = parseFloat(priceText.replace('$', ''));

    console.log(`[pickRandom] index=${index} → "${name}"  ${priceText}`);
    return { name, desc, price, priceText };
  }

  async pickMultipleRandom(
    howMany: number,
  ): Promise<{ name: string; desc: string; price: number; priceText: string }[]> {
    const total = await this.inventoryItems.count();
    if (howMany > total)
      throw new Error(`Requested ${howMany} products but only ${total} available`);

    // Shuffle indices and take the first `howMany` — guarantees no duplicates
    const indices = Array.from({ length: total }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, howMany);

    const products: { name: string; desc: string; price: number; priceText: string }[] = [];

    for (const index of indices) {
      const item = this.inventoryItems.nth(index);
      const name = (await item.locator('.inventory_item_name').textContent())!.trim();
      const desc = (await item.locator('.inventory_item_desc').textContent())!.trim();
      const priceText = (await item.locator('.inventory_item_price').textContent())!.trim();
      const price = parseFloat(priceText.replace('$', ''));

      console.log(`[pickMultipleRandom] index=${index} → "${name}"  ${priceText}`);
      products.push({ name, desc, price, priceText });
    }

    return products;
  }

  async addItemToCart(itemName: string) {
    await this.clickButton(this.addToCartBtn(itemName));
  }

  async addToCartByName(itemName: string) {
    await this.clickButton(this.addToCartBtn(itemName));
  }

  async removeItemFromCart(itemName: string) {
    await this.clickButton(this.removeBtn(itemName));
  }

  async addMultipleItemsToCart(itemNames: string[]) {
    for (const name of itemNames) {
      await this.addItemToCart(name);
    }
  }

  async goToCart() {
    await this.cartLink.click();
    await this.assertUrl(/cart/);
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
    await this.assertUrl(ROUTES.login);
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  async assertOnInventoryPage() {
    await this.assertUrl(/inventory/);
    await this.assertVisible(this.inventoryList);
  }

  async assertCartCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async assertItemCount(expected: number) {
    await expect(this.inventoryItems).toHaveCount(expected);
  }

  async getItemPrice(itemName: string): Promise<number> {
    const text = await this.itemPrice(itemName).textContent();
    return parseFloat(text!.replace('$', ''));
  }

  async getAllPrices(): Promise<number[]> {
    const priceLocators = this.page.locator('.inventory_item_price');
    const texts = await priceLocators.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async getAllNames(): Promise<string[]> {
    const nameLocators = this.page.locator('.inventory_item_name');
    return nameLocators.allTextContents();
  }
}
