import { test } from '../../../fixtures';

test.describe('Random product → add to cart → verify in cart', { tag: '@regression' }, () => {

  test('[TC-RAND-01] 1 random product: details in cart match inventory',
    { annotation: { type: 'testId', description: 'TC-RAND-01' } },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.navigate();

      const product = await test.step('Step 1: Pick a random product', () =>
        inventoryPage.pickRandom(),
      );

      await test.step('Step 2: Add to cart and verify badge = 1', async () => {
        await inventoryPage.addItemToCart(product.name);
        await inventoryPage.assertCartCount(1);
      });

      await test.step('Step 3: Navigate to cart', () =>
        inventoryPage.goToCart(),
      );

      const cartItem = await test.step('Step 4: Read cart item details', () =>
        cartPage.getCartItemDetail(product.name),
      );

      await test.step('Step 5: Assert cart item matches inventory data', () =>
        cartPage.assertProductMatchesInventory(cartItem, product),
      );
    });

  test('[TC-RAND-02] 3 random products: all details in cart match inventory',
    { annotation: { type: 'testId', description: 'TC-RAND-02' } },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.navigate();

      const products = await test.step('Step 1: Pick 3 unique random products', () =>
        inventoryPage.pickMultipleRandom(3),
      );

      await test.step('Step 2: Add all 3 products to cart', async () => {
        for (const product of products) {
          await inventoryPage.addItemToCart(product.name);
        }
        await inventoryPage.assertCartCount(products.length);
      });

      await test.step('Step 3: Navigate to cart', () =>
        inventoryPage.goToCart(),
      );

      await test.step('Step 4: Assert every product matches inventory data', async () => {
        for (const product of products) {
          const cartItem = await cartPage.getCartItemDetail(product.name);
          await cartPage.assertProductMatchesInventory(cartItem, product);
        }
      });
    });

});
