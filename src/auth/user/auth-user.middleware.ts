import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HTTP_AUTH_HEADER } from '../auth.config';
import { ValidUtil } from '../util';
import { VerifierService } from '../verifier';
import { AuthUserUtil } from './auth-user.util';
import { AuthError } from './auth.error';


/**
 * The middleware verify the request and build the auth user.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private verifierService: VerifierService) {
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<any> {

    const token = req.header(HTTP_AUTH_HEADER);

    if (ValidUtil.notEmpty(token)) {
      try {

        const authUser = await this.verifierService.fromToken(token);
        AuthUserUtil.updateRequest(req, authUser);

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
