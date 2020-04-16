import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DbUtil } from './db.util';

export const DbConn = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return DbUtil.getConnection(req);
});
