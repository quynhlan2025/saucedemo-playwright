import { test, expect } from '../../../fixtures';

/**
 * Demo: soft assertions with automatic screenshot on failure.
 *
 * softAssertWithScreenshot(assertion, screenshotName):
 *   - Runs the assertion
 *   - On failure → saves screenshot to screenshots/<name>.png
 *   - Registers a soft failure (test continues, all failures reported at end)
 */
test.describe('Soft assert with screenshot on failure', { tag: '@regression' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.navigate();
  });

  test(
    '[TC-SOFT-01] cart badge count — wrong expected value triggers screenshot',
    { annotation: { type: 'testId', description: 'TC-SOFT-01' } },
    async ({ inventoryPage }) => {
      const product = await inventoryPage.pickRandom();
      await inventoryPage.addItemToCart(product.name);

      
      // ✅ Correct assertion — passes, no screenshot
      await inventoryPage.softAssertWithScreenshot(
        () => expect(inventoryPage.cartBadge).toHaveText('1'),
        'TC-SOFT-01-badge-correct',
      );

      // ❌ Wrong expected value — fails, screenshot saved
      await inventoryPage.softAssertWithScreenshot(
        () => expect(inventoryPage.cartBadge).toHaveText('99'),
        'TC-SOFT-01-badge-wrong',
      );
    },
  );

  test(
    '[TC-SOFT-02] product title on inventory page — multiple soft checks with screenshots',
    { annotation: { type: 'testId', description: 'TC-SOFT-02' } },
    async ({ inventoryPage }) => {
      const pageTitle = inventoryPage.pageTitle;

      // ✅ Correct title — passes
      await inventoryPage.softAssertWithScreenshot(
        () => expect(pageTitle).toHaveText('Products'),
        'TC-SOFT-02-title-correct',
      );

      // ❌ Wrong title — fails, screenshot saved; test still continues to next check
      await inventoryPage.softAssertWithScreenshot(
        () => expect(pageTitle).toHaveText('Wrong Title'),
        'TC-SOFT-02-title-wrong',
      );

      // ✅ Item count is 6 — passes
      await inventoryPage.softAssertWithScreenshot(
        () => expect(inventoryPage.inventoryItems).toHaveCount(6),
        'TC-SOFT-02-item-count',
      );
    },
  );

  test(
    '[TC-SOFT-03] cart page — verify item details after add, multiple fields checked',
    { annotation: { type: 'testId', description: 'TC-SOFT-03' } },
    async ({ inventoryPage, cartPage }) => {
      const product = await inventoryPage.pickRandom();
      await inventoryPage.addItemToCart(product.name);
      await inventoryPage.goToCart();

      const cartItem = await cartPage.getCartItemDetail(product.name);

      // ✅ Name matches — passes
      await cartPage.softAssertWithScreenshot(
        () => { expect(cartItem.name).toBe(product.name); return Promise.resolve(); },
        'TC-SOFT-03-name-correct',
      );

      // ❌ Price wrong — fails, screenshot saved; remaining checks still run
      await cartPage.softAssertWithScreenshot(
        () => { expect(cartItem.price).toBe(999); return Promise.resolve(); },
        'TC-SOFT-03-price-wrong',
      );

      // ✅ Quantity is 1 — passes
      await cartPage.softAssertWithScreenshot(
        () => { expect(cartItem.qty).toBe(1); return Promise.resolve(); },
        'TC-SOFT-03-qty-correct',
      );
    },
  );
});
