import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CommonError } from '../../common/error';
import { VerifierService } from '../verifier';
import { AUTH_MIDDLEWARE_CONFIG, AuthMiddlewareConfig } from './auth-middleware.config';
import { updateRequest } from './auth-middleware.util';

@Injectable()
export class AuthMiddlewareService implements NestMiddleware {

  constructor(@Inject(AUTH_MIDDLEWARE_CONFIG) private config: AuthMiddlewareConfig, private verifier: VerifierService) {
  }

  use(req: Request, res: Response, next: NextFunction): any {

    const token = req.header(this.config.headerName);

    if (token) {
      try {

        const authUser = this.verifier.fromToken(token);
        updateRequest(req, authUser);

      } catch (e) {
        next(e);
      }

      // continues
      return next();
    }

    // The request needs an authorization header
    next(new CommonError(HttpStatus.UNAUTHORIZED, 'auth', 'unauthorized', 'Request needs authorization'));
  }
}
