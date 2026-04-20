import { test } from '../../fixtures';

/**
 * SM-03 — Add to cart is the #1 business-critical action.
 * If users can't add items → cart is empty → checkout impossible.
 */
test.describe('[SM-03] Add to cart', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test(
    '[TC-SM-03-A] add 1 random product → badge shows 1',
    { annotation: { type: 'testId', description: 'TC-SM-03-A' } },
    async ({ inventoryPage }) => {
      const product = await inventoryPage.pickRandom();
      await inventoryPage.addItemToCart(product.name);
      await inventoryPage.assertCartCount(1);
    },
  );

  test(
    '[TC-SM-03-B] add 3 random products → badge shows 3',
    { annotation: { type: 'testId', description: 'TC-SM-03-B' } },
    async ({ inventoryPage }) => {
      const products = await inventoryPage.pickMultipleRandom(3);
      for (const p of products) {
        await inventoryPage.addItemToCart(p.name);
      }
      await inventoryPage.assertCartCount(3);
    },
  );

  test(
    '[TC-SM-03-C] cart page reflects correct product details',
    { annotation: { type: 'testId', description: 'TC-SM-03-C' } },
    async ({ inventoryPage, cartPage }) => {
      const product = await inventoryPage.pickRandom();
      await inventoryPage.addItemToCart(product.name);
      await inventoryPage.goToCart();

      const cartItem = await cartPage.getCartItemDetail(product.name);
      await cartPage.assertProductMatchesInventory(cartItem, product);
    },
  );
});
