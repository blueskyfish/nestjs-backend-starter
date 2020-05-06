import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HTTP_AUTH_HEADER } from '../../auth';
import { ValidUtil } from '../../auth/util';
import { DbUtil } from '../../common/database';
import { AuthError } from '../errors';
import { updateRequest } from './auth-middleware.util';
import { AuthUserService } from './auth-user.service';


/**
 * The middleware verify the request and build the auth user.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private authUserCache: AuthUserService) {
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<any> {

    const token = req.header(HTTP_AUTH_HEADER);

    if (ValidUtil.notEmpty(token)) {
      try {

        const authUser = await this.authUserCache.verifyAndBuildAuthUser(token);
        updateRequest(req, authUser);

      } catch (e) {
        next(e);
      }

      // continues
      return next();
    }

    // The request needs an authorization header
    return next(new AuthError('unauthorized', 'Request needs authorization'));
  }
}
