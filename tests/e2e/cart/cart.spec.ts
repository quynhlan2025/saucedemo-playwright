import { test } from '../../../fixtures';

test.describe('Cart page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test('[TC-CART-01] should reflect items added from inventory',
    { annotation: { type: 'testId', description: 'TC-CART-01' } },
    async ({ inventoryPage, cartPage }) => {
      const products = await inventoryPage.pickMultipleRandom(2);
      for (const p of products) {
        await inventoryPage.addItemToCart(p.name);
      }
      await inventoryPage.goToCart();

      await cartPage.assertCartItemCount(2);
      for (const p of products) {
        await cartPage.assertItemInCart(p.name);
      }
    });

  test('[TC-CART-02] should remove item from cart page',
    { annotation: { type: 'testId', description: 'TC-CART-02' } },
    async ({ inventoryPage, cartPage }) => {
      const product = await inventoryPage.pickRandom();
      await inventoryPage.addItemToCart(product.name);
      await inventoryPage.goToCart();

      await cartPage.removeItem(product.name);
      await cartPage.assertCartItemCount(0);
      await cartPage.assertItemNotInCart(product.name);
    });

  test('[TC-CART-03] should navigate to checkout',
    { annotation: { type: 'testId', description: 'TC-CART-03' } },
    async ({ inventoryPage, cartPage }) => {
      const product = await inventoryPage.pickRandom();
      await inventoryPage.addItemToCart(product.name);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

  test('[TC-CART-04] should continue shopping from cart',
    { annotation: { type: 'testId', description: 'TC-CART-04' } },
    async ({ inventoryPage, cartPage }) => {
      const product = await inventoryPage.pickRandom();
      await inventoryPage.addItemToCart(product.name);
      await inventoryPage.goToCart();
      await cartPage.continueShopping();
    });
});
