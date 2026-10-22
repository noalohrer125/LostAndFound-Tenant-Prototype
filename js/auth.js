// Fake admin login for the prototype. The session is scoped to one tenant.
import { DEMO_LOGIN } from './data.js';

const SESSION_KEY = 'lost-and-found-session';

export const auth = {
  login(tenantId, username, password) {
    const ok = username === DEMO_LOGIN.username && password === DEMO_LOGIN.password;
    if (ok) sessionStorage.setItem(SESSION_KEY, tenantId);
    return ok;
  },
  logout: () => sessionStorage.removeItem(SESSION_KEY),
  isAdmin: tenantId => sessionStorage.getItem(SESSION_KEY) === tenantId,
};
