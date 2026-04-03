import { test } from '../../../fixtures';

test.describe('Random product → add to cart → verify in cart', { tag: '@regression' }, () => {

  test('[TC-RAND-01] 1 random product: details in cart match inventory',
    { annotation: { type: 'testId', description: 'TC-RAND-01' } },
    async ({ inventoryPage, cartPage }) => {
      // Step 1: Navigate to inventory
      await inventoryPage.navigate();

      // Step 3: Pick a random product (logged to console each run)
      const product = await inventoryPage.pickRandom();

      // Step 4: Add to cart → assert badge = 1
      await inventoryPage.addToCartByName(product.name);
      await inventoryPage.assertCartCount(1);

      // Step 5: Go to cart
      await inventoryPage.goToCart();

      // Step 6: Get cart item detail for the selected product
      const cartItem = await cartPage.getCartItemDetail(product.name);

      // Step 7: Verify name / desc / price / priceText / qty match inventory
      await cartPage.assertProductMatchesInventory(cartItem, product);
    });

  test('[TC-RAND-02] 3 random products: all details in cart match inventory',
    { annotation: { type: 'testId', description: 'TC-RAND-02' } },
    async ({ inventoryPage, cartPage }) => {
      // Step 1: Navigate to inventory
      await inventoryPage.navigate();

      // Step 3: Pick 3 unique random products → add each to cart consecutively
      const products = await inventoryPage.pickMultipleRandom(3);

      for (const product of products) {
        await inventoryPage.addToCartByName(product.name);
      }

      // Assert badge reflects all 3 items
      await inventoryPage.assertCartCount(products.length);

      // Step 4: All product info already captured above (name / desc / price / priceText)

      // Step 5: Go to cart → verify every product's detail matches what was shown in inventory
      await inventoryPage.goToCart();

      for (const product of products) {
        const cartItem = await cartPage.getCartItemDetail(product.name);
        await cartPage.assertProductMatchesInventory(cartItem, product);
      }
    });

});
