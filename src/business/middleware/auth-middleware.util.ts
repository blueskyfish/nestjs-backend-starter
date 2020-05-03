import { Request } from 'express';
import { AuthUser } from '../../auth/auth.user';

const DUMMY = new AuthUser({
  id: -1,
  device: -1,
  roles: [],
});

export function updateRequest(req: Request, authUser: AuthUser) {
  (req as any).authUser = authUser;
}

export function getAuthUser(req: Request): AuthUser {
  return (req as any).authUser || DUMMY;
}
