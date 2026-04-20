// ─── App URLs ────────────────────────────────────────────────────────────────
export const ROUTES = {
  login: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkout: '/checkout-step-one.html',
  checkoutTwo: '/checkout-step-two.html',
  complete: '/checkout-complete.html',
} as const;

// ─── Timeouts ─────────────────────────────────────────────────────────────────
export const TIMEOUT = {
  short: 5_000,
  medium: 15_000,
  long: 30_000,
  extraLong: 60_000,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function parseCurrency(text: string): number {
  return parseFloat(text.replace('$', ''));
}

// ─── Re-exports from test-data (kept for backward compatibility) ──────────────
export { USERS } from '../test-data/users';
export type { UserKey } from '../test-data/users';
