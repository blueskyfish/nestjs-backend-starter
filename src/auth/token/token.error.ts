import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/error';

export const KEEPER_ERROR_GROUP = 'token'

/**
 * An error by keeping an token
 */
export class TokenError extends CommonError {

  constructor(code: string, message: string) {
    super(HttpStatus.BAD_REQUEST, KEEPER_ERROR_GROUP, code, message);
  }
}
