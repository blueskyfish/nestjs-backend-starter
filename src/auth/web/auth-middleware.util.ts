import { Request } from 'express';
import { SecondUtil } from '../../common/util';
import { AuthUser } from '../auth.user';

const DUMMY = new AuthUser({
  id: -1,
  device: -1,
  roles: [],
  creation: SecondUtil.now(),
  expires: SecondUtil.fromMinutes(1),
});

export function updateRequest(req: Request, authUser: AuthUser) {
  (req as any).authUser = authUser;
}

export function getAuthUser(req: Request): AuthUser {
  return (req as any).authUser || DUMMY;
}
