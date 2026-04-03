# SauceDemo Playwright

E2E testing framework for [saucedemo.com](https://www.saucedemo.com) — Playwright + TypeScript.

---

## Project Structure

```ini
saucedemo-playwright/ 
├── pages/
│   ├── BasePage.ts               # Base class (highlight, click, fill)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── CartPage.ts
├── tests/
│   ├── auth.setup.ts             # Login once, save shared session
│   ├── smoke/                    # Smoke tests — run quickly after each deploy
│   │   ├── sm-01-login.spec.ts
│   │   ├── sm-02-inventory.spec.ts
│   │   ├── sm-03-add-to-cart.spec.ts
│   │   ├── sm-04-checkout.spec.ts
│   │   └── sm-05-logout.spec.ts
│   └── e2e/                      # E2E tests — full regression
│       ├── auth/
│       │   ├── login.spec.ts
│       │   └── inventory/
│       │       └── inventory.spec.ts
│       └── cart/
│           ├── cart.spec.ts
│           └── add-to-cart.spec.ts
├── utils/
│   ├── constants.ts              # USERS, ROUTES, TIMEOUT
│   └── env.ts                    # Environment config (prod/staging/dev)
├── fixtures/
│   └── index.ts                  # Custom fixtures
└── playwright.config.ts
```

---

## Installation

```bash
npm install
npx playwright install
```

---

## Running Tests

### Full test suite

```bash
npx playwright test
```

---

### Smoke tests

Run quickly after each deploy — covers the critical path.

```bash
# All smoke tests (using @smoke tag) on Production
npm run test:smoke
TEST_ENV=prod npm run test:smoke:chrome

# Individual smoke files
npx playwright test tests/smoke/sm-01-login.spec.ts
npx playwright test tests/smoke/sm-02-inventory.spec.ts
npx playwright test tests/smoke/sm-03-add-to-cart.spec.ts
npx playwright test tests/smoke/sm-04-checkout.spec.ts
npx playwright test tests/smoke/sm-05-logout.spec.ts
```

| File                | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `sm-01-login`       | App cannot be used if login is broken              |
| `sm-02-inventory`   | Core content fails to load = nothing left to test  |
| `sm-03-add-to-cart` | Add to cart is the #1 business-critical action     |
| `sm-04-checkout`    | Full purchase flow — if this fails, revenue = 0    |
| `sm-05-logout`      | Security boundary — logout must truly block access |

---

### Regression tests

Full regression — run before release.

```bash
# All regression tests (using @regression tag) on Production

TEST_ENV=prod npm run test:regression:chrome

# On a specific browser
npm run test:regression:chrome
npm run test:regression:firefox

# All e2e tests (by folder)
npx playwright test tests/e2e

# Individual files
npx playwright test tests/e2e/auth/login.spec.ts
npx playwright test tests/e2e/auth/inventory/inventory.spec.ts
npx playwright test tests/e2e/cart/cart.spec.ts
npx playwright test tests/e2e/cart/add-to-cart.spec.ts
```

---

### Run by Test ID

```bash
# A specific test ID
npx playwright test --grep "TC-LOGIN-07"
npx playwright test --grep "TC-SM-04"

# Run by group
npx playwright test --grep "TC-LOGIN"
npx playwright test --grep "TC-INV"
npx playwright test --grep "TC-CART"
npx playwright test --grep "TC-RAND"
npx playwright test --grep "TC-SM"
```

---

### Environments

Default runs `prod`. Switch environment using the `TEST_ENV` variable.

```bash
# Prod (default)
npx playwright test

# Prod (explicit)
TEST_ENV=prod npx playwright test

# Staging
TEST_ENV=staging npx playwright test

# Dev (localhost:3000)
TEST_ENV=dev npx playwright test

# Smoke on prod
TEST_ENV=prod npx playwright test --grep @smoke
```

---

### Browser selection

```bash
# Chrome (default)
npm run test:chrome

# Firefox
npm run test:firefox

# Chrome + browser opens (slowMo 800ms)
npm run test:headed:chrome

# Firefox + browser opens (slowMo 800ms)
npm run test:headed:firefox
```

Combine with other flags:

```bash
npm run test:chrome -- --grep @smoke
npm run test:firefox -- --grep "TC-SM-04"
TEST_ENV=staging npm run test:firefox
TEST_ENV=prod npm run test:regression:chrome
```

---

### Browser mode

```bash
# Headed — browser opens with slowMo 800ms (current default)
npx playwright test

# Headless — no browser window, runs faster
npx playwright test --headed=false
```

Adjust slowMo speed in `playwright.config.ts`:

```ts
launchOptions: {
  slowMo: 800;
} // increase = slower, decrease = faster
```

---

### Debug & Report

```bash
# UI mode — pick tests, view trace live
npx playwright test --ui

# Debug mode — step through each action
npx playwright test --debug

# View HTML report after a run
npx playwright show-report
```

---

## Test IDs

| ID             | File            | Description                                 |
| -------------- | --------------- | ------------------------------------------- |
| TC-LOGIN-01    | e2e/login       | Login form visible                          |
| TC-LOGIN-02    | e2e/login       | Login success — standard_user               |
| TC-LOGIN-03    | e2e/login       | Error — locked_out_user                     |
| TC-LOGIN-04    | e2e/login       | Error — wrong credentials                   |
| TC-LOGIN-05    | e2e/login       | Error — empty username                      |
| TC-LOGIN-06    | e2e/login       | Error — empty password                      |
| TC-LOGIN-07    | e2e/login       | Block locked_out + prevent inventory access |
| TC-LOGIN-08    | e2e/login       | Logout successfully                         |
| TC-INV-01      | e2e/inventory   | Display 6 products                          |
| TC-INV-02      | e2e/inventory   | Add single item to cart                     |
| TC-INV-03      | e2e/inventory   | Add multiple items to cart                  |
| TC-INV-04      | e2e/inventory   | Remove item on inventory page               |
| TC-INV-05      | e2e/inventory   | Sort A→Z                                    |
| TC-INV-06      | e2e/inventory   | Sort price low→high                         |
| TC-CART-01     | e2e/cart        | Cart reflects inventory items               |
| TC-CART-02     | e2e/cart        | Remove item from cart                       |
| TC-CART-03     | e2e/cart        | Navigate to checkout                        |
| TC-CART-04     | e2e/cart        | Continue shopping                           |
| TC-RAND-01     | e2e/add-to-cart | 1 random product matches inventory          |
| TC-RAND-02     | e2e/add-to-cart | 3 random products match inventory           |
| TC-SM-01-A/B/C | smoke/sm-01     | Login smoke                                 |
| TC-SM-02-A/B/C | smoke/sm-02     | Inventory smoke                             |
| TC-SM-03-A/B/C | smoke/sm-03     | Add to cart smoke                           |
| TC-SM-04       | smoke/sm-04     | Full checkout smoke                         |
| TC-SM-05-A/B/C | smoke/sm-05     | Logout smoke                                |

---

## Test Users

| Key           | Username                | Notes                        |
| ------------- | ----------------------- | ---------------------------- |
| `standard`    | standard_user           | Regular user                 |
| `locked`      | locked_out_user         | Locked — test error handling |
| `problem`     | problem_user            | Broken UI — test edge cases  |
| `performance` | performance_glitch_user | Slow — test timeout handling |
