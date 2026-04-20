import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, parseCurrency } from '../utils/constants';

export type ProductInfo = {
  name: string;
  desc: string;
  price: number;
  priceText: string;
};

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

  // ── Private locator helpers ────────────────────────────────────────────────
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

  private itemPriceLocator(itemName: string) {
    return this.page.locator(`.inventory_item:has-text("${itemName}") .inventory_item_price`);
  }

  // ── Private data helpers ───────────────────────────────────────────────────
  private async readProductInfo(item: ReturnType<Page['locator']>): Promise<ProductInfo> {
    const name = await this.getText(item.locator('.inventory_item_name'));
    const desc = await this.getText(item.locator('.inventory_item_desc'));
    const priceText = await this.getText(item.locator('.inventory_item_price'));
    return { name, desc, priceText, price: parseCurrency(priceText) };
  }

  // ── Fisher-Yates shuffle ───────────────────────────────────────────────────
  private shuffleIndices(length: number): number[] {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async navigate() {
    await this.goto(ROUTES.inventory);
  }

  async pickRandom(): Promise<ProductInfo> {
    const count = await this.inventoryItems.count();
    const index = Math.floor(Math.random() * count);
    const product = await this.readProductInfo(this.inventoryItems.nth(index));
    console.log(`[pickRandom] index=${index} → "${product.name}"  ${product.priceText}`);
    return product;
  }

  async pickMultipleRandom(howMany: number): Promise<ProductInfo[]> {
    const total = await this.inventoryItems.count();
    if (howMany > total)
      throw new Error(`Requested ${howMany} products but only ${total} available`);

    const indices = this.shuffleIndices(total).slice(0, howMany);
    const products: ProductInfo[] = [];

    for (const index of indices) {
      const product = await this.readProductInfo(this.inventoryItems.nth(index));
      console.log(`[pickMultipleRandom] index=${index} → "${product.name}"  ${product.priceText}`);
      products.push(product);
    }

    return products;
  }

  async addItemToCart(itemName: string) {
    await this.step(`Add "${itemName}" to cart`, async () => {
      await this.clickButton(this.addToCartBtn(itemName));
    });
  }

  async removeItemFromCart(itemName: string) {
    await this.step(`Remove "${itemName}" from cart`, async () => {
      await this.clickButton(this.removeBtn(itemName));
    });
  }

  async addMultipleItemsToCart(itemNames: string[]) {
    await this.step(`Add ${itemNames.length} items to cart`, async () => {
      for (const name of itemNames) {
        await this.addItemToCart(name);
      }
    });
  }

  async goToCart() {
    await this.step('Navigate to cart', async () => {
      await this.cartLink.click();
      await this.assertUrl(/cart/);
    });
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    const labels: Record<string, string> = {
      az: 'A→Z',
      za: 'Z→A',
      lohi: 'Price low→high',
      hilo: 'Price high→low',
    };
    await this.step(`Sort products: ${labels[option]}`, async () => {
      await this.sortDropdown.selectOption(option);
    });
  }

  async logout() {
    await this.step('Logout via burger menu', async () => {
      await this.menuButton.click();
      await this.logoutLink.click();
      await this.assertUrl(ROUTES.login);
    });
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
    return parseCurrency(await this.getText(this.itemPriceLocator(itemName)));
  }

  async getAllPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map(parseCurrency);
  }

  async getAllNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }
}
