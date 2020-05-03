import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/error';

export const AUTH_ERROR_GROUP = 'auth';

export class AuthError extends CommonError {

  constructor(code: string, message: string) {
    super(HttpStatus.UNAUTHORIZED, AUTH_ERROR_GROUP, code, message);
  }
}
