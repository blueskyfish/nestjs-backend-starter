import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getAuthUser } from './auth-middleware.util';

/**
 * Extract the auth user from the request. If the auth user is not exist, then it is returns an dummy user.
 *
 * **Usage**
 *
 * ```ts
 * getBookList(@AuthUser() authUser: AuthUser): Promise<Book[]>
 * ```
 */
export const AuthUser = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return getAuthUser(req);
});
