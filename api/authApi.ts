import { BrowserContext } from '@playwright/test';
import { BASE_URL } from '../utils/env';

// For apps with a real REST auth endpoint this module would call
// POST /api/auth/token and return a JWT or session cookie.
//
// Saucedemo validates credentials client-side via JavaScript and then
// sets a `session-username` cookie. We replicate that end-state by
// injecting the cookie directly — same result, zero UI overhead.
//
// Pattern used in production when:
//   • The app exposes /api/login → call it, parse Set-Cookie, inject.
//   • The app is a known SPA with a predictable session cookie structure.

export async function authenticateViaApi(
  context: BrowserContext,
  username: string,
): Promise<void> {
  const domain = new URL(BASE_URL).hostname;

  await context.addCookies([
    {
      name: 'session-username',
      value: username,
      domain,
      path: '/',
    },
  ]);
}
