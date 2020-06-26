import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from './auth-user';
import { AuthUserUtil } from './auth-user.util';

/**
 * Extract the auth user from the request. If the auth user is not exist, then it is returns an dummy user.
 *
 * **Usage**
 *
 * ```ts
 * getBookList(@GetAuthUser() authUser: AuthUser): Promise<Book[]>
 * ```
 */
export const GetAuthUser = createParamDecorator((data: any, ctx: ExecutionContext): AuthUser => {

  const req = ctx.switchToHttp().getRequest<Request>();

  return AuthUserUtil.getAuthUser(req);
});
