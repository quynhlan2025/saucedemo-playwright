import { test, expect } from '../../fixtures';
import { TIMEOUT } from '../../utils/constants';
import { checkoutCustomer } from '../data/checkoutData';

/**
 * SM-04 — Full purchase flow — if this fails, revenue = 0.
 * Covers the entire happy path: inventory → cart → checkout → complete.
 */
test.describe('[SM-04] Checkout (full purchase flow)', { tag: '@smoke' }, () => {
  test(
    '[TC-SM-04] complete purchase from inventory to order confirmation',
    { annotation: { type: 'testId', description: 'TC-SM-04' }, timeout: TIMEOUT.extraLong },
    async ({ inventoryPage, cartPage }) => {
      // Step 1: Navigate to inventory and pick a product
      await inventoryPage.navigate();
      const product = await inventoryPage.pickRandom();

      // Step 2: Add to cart → go to cart
      await inventoryPage.addToCartByName(product.name);
      await inventoryPage.assertCartCount(1);
      await inventoryPage.goToCart();

      // Step 3: Verify item in cart then proceed to checkout
      await cartPage.assertItemInCart(product.name);
      await cartPage.proceedToCheckout();

      // Step 4: Fill in customer info
      const page = cartPage.page;
      await page.locator('[data-test="firstName"]').fill(checkoutCustomer.firstName);
      await page.locator('[data-test="lastName"]').fill(checkoutCustomer.lastName);
      await page.locator('[data-test="postalCode"]').fill(checkoutCustomer.postalCode);
      await page.locator('[data-test="continue"]').click();

      // Step 5: Order summary — verify item and price are present
      await expect(page).toHaveURL(/checkout-step-two/);
      await expect(page.locator('.cart_item')).toContainText(product.name);
      await expect(page.locator('.summary_total_label')).toBeVisible();

      // Step 6: Finish → confirmation page
      await page.locator('[data-test="finish"]').click();
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    },
  );
});
