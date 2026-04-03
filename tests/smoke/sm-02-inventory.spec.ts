import { test, expect } from '../../fixtures';

/**
 * SM-02 — Core content không load = không có gì để test tiếp.
 * If inventory is broken → no products = no cart = no revenue.
 */
test.describe('[SM-02] Inventory', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('[TC-SM-02-A] inventory page loads and is accessible',
    { annotation: { type: 'testId', description: 'TC-SM-02-A' } },
    async ({ inventoryPage }) => {
      await inventoryPage.assertOnInventoryPage();
    });

    
  test('[TC-SM-02-B] inventory displays 6 products',
    { annotation: { type: 'testId', description: 'TC-SM-02-B' } },
    async ({ inventoryPage }) => {
      await inventoryPage.assertItemCount(6);
    });

  test('[TC-SM-02-C] each product has name and price visible',
    { annotation: { type: 'testId', description: 'TC-SM-02-C' } },
    async ({ inventoryPage }) => {
      const count = await inventoryPage.inventoryItems.count();
      for (let i = 0; i < count; i++) {
        const item  = inventoryPage.inventoryItems.nth(i);
        const name  = item.locator('.inventory_item_name');
        const price = item.locator('.inventory_item_price');
        await expect(name).not.toBeEmpty();
        await expect(price).not.toBeEmpty();
      }
    });
});
