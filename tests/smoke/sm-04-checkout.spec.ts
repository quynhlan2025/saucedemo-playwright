import { test } from '../../fixtures';
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
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      const product = await test.step('Step 1: Navigate to inventory and pick a random product', async () => {
        await inventoryPage.navigate();
        return inventoryPage.pickRandom();
      });

      await test.step('Step 2: Add product to cart and navigate to cart', async () => {
        await inventoryPage.addItemToCart(product.name);
        await inventoryPage.assertCartCount(1);
        await inventoryPage.goToCart();
      });

      await test.step('Step 3: Verify item in cart and proceed to checkout', async () => {
        await cartPage.assertItemInCart(product.name);
        await cartPage.proceedToCheckout();
      });

      await test.step('Step 4: Fill customer info and continue', () =>
        checkoutPage.fillCustomerInfoAndContinue(checkoutCustomer),
      );

      await test.step('Step 5: Verify order summary', () =>
        checkoutPage.assertOrderSummaryContains(product.name),
      );

      await test.step('Step 6: Finish order and verify confirmation', async () => {
        await checkoutPage.finish();
        await checkoutPage.assertOrderConfirmed();
      });
    },
  );
});
