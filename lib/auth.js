import Iron from '@hapi/iron';
import { MAX_AGE, setTokenCookie, getTokenCookie } from './auth-cookies';

const IRON_SEAL_PASSWORD = process.env.IRON_SEAL_PASSWORD;

export async function setLoginSession(res, session) {
  const createdAt = Date.now();

  // Create a session object with a max age that we can validate later
  const obj = { ...session, createdAt, maxAge: MAX_AGE };

  const token = await Iron.seal(obj, IRON_SEAL_PASSWORD, Iron.defaults);

  setTokenCookie(res, token);
}

export async function getLoginSession(req) {
  const token = getTokenCookie(req);

  if (!token) return;

  const session = await Iron.unseal(token, IRON_SEAL_PASSWORD, Iron.defaults);
  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired');
  }

  return session;
}
