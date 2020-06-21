import { Request } from 'express';
import { AuthUser } from '../../auth';

/**
 * The dummy user
 */
const DUMMY = new AuthUser({
  id: -1,
  device: -1,
  roles: [],
});

/**
 * Update the request with the auth user.
 *
 * @param {e.Request} req the request
 * @param {AuthUser} authUser the auth user
 */
export function updateRequest(req: Request, authUser: AuthUser) {
  (req as any).authUser = authUser;
}

/**
 * Get the auth user from the request and if the request has no user, then it returns the dummy user.
 *
 * @param {e.Request} req the request
 * @returns {AuthUser} the auth user
 */
export function getAuthUser(req: Request): AuthUser {
  return (req as any).authUser || DUMMY;
}
