import { test, expect } from '../../../../fixtures';

test.describe('Inventory page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('[TC-INV-01] should display 6 products',
    { annotation: { type: 'testId', description: 'TC-INV-01' } },
    async ({ inventoryPage }) => {
      await inventoryPage.assertItemCount(6);
    });

  test('[TC-INV-02] should add single item to cart',
    { annotation: { type: 'testId', description: 'TC-INV-02' } },
    async ({ inventoryPage }) => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.assertCartCount(1);
    });

  test('[TC-INV-03] should add multiple items to cart',
    { annotation: { type: 'testId', description: 'TC-INV-03' } },
    async ({ inventoryPage }) => {
      await inventoryPage.addMultipleItemsToCart([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
      ]);
      await inventoryPage.assertCartCount(3);
    });

  test('[TC-INV-04] should remove item from cart on inventory page',
    { annotation: { type: 'testId', description: 'TC-INV-04' } },
    async ({ inventoryPage }) => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.assertCartCount(1);
      await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
      await inventoryPage.assertCartCount(0);
    });

  test('[TC-INV-05] should sort products by name A→Z',
    { annotation: { type: 'testId', description: 'TC-INV-05' } },
    async ({ inventoryPage }) => {
      await inventoryPage.sortProducts('az');
      const names = await inventoryPage.getAllNames();
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sorted);
    });

  test('[TC-INV-08] should sort products by name Z→A',
    { annotation: { type: 'testId', description: 'TC-INV-08' } },
    async ({ inventoryPage }) => {
      await inventoryPage.sortProducts('za');
      const names = await inventoryPage.getAllNames();
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sorted);
    });

  test('[TC-INV-06] should sort products by price low→high',
    { annotation: { type: 'testId', description: 'TC-INV-06' } },
    async ({ inventoryPage }) => {
      await inventoryPage.sortProducts('lohi');
      const prices = await inventoryPage.getAllPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

  test('[TC-INV-07] should sort products by price high→low',
    { annotation: { type: 'testId', description: 'TC-INV-07' } },
    async ({ inventoryPage }) => {
      await inventoryPage.sortProducts('hilo');
      const prices = await inventoryPage.getAllPrices();
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });
});
