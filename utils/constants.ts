// ─── App URLs ────────────────────────────────────────────────────────────────
export const BASE_URL = 'https://www.saucedemo.com';

export const ROUTES = {
  login: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkout: '/checkout-step-one.html',
  checkoutTwo: '/checkout-step-two.html',
  complete: '/checkout-complete.html',
} as const;

// ─── Test Users ───────────────────────────────────────────────────────────────
export const USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
} as const;

export type UserKey = keyof typeof USERS;

// ─── Timeouts ─────────────────────────────────────────────────────────────────
export const TIMEOUT = {
  short: 5_000,
  medium: 15_000,
  long: 30_000,
  extraLong: 60_000,
} as const;
