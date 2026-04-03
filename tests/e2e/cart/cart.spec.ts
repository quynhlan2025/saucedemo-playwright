import { test, expect } from '../../../fixtures';

test.describe('Cart page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('[TC-CART-01] should reflect items added from inventory',
    { annotation: { type: 'testId', description: 'TC-CART-01' } },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      await inventoryPage.goToCart();

      await cartPage.assertCartItemCount(2);
      await cartPage.assertItemInCart('Sauce Labs Backpack');
      await cartPage.assertItemInCart('Sauce Labs Bike Light');
    });

  test('[TC-CART-02] should remove item from cart page',
    { annotation: { type: 'testId', description: 'TC-CART-02' } },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.goToCart();

      await cartPage.removeItem('Sauce Labs Backpack');
      await cartPage.assertCartItemCount(0);
      await cartPage.assertItemNotInCart('Sauce Labs Backpack');
    });

  test('[TC-CART-03] should navigate to checkout',
    { annotation: { type: 'testId', description: 'TC-CART-03' } },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

  test('[TC-CART-04] should continue shopping from cart',
    { annotation: { type: 'testId', description: 'TC-CART-04' } },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.goToCart();
      await cartPage.continueShopping();
    });
});
