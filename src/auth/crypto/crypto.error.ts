import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/error';

export const CRYPTO_ERROR_GROUP = 'crypto';

export class CryptoError extends CommonError {

  constructor(code: string, message: string) {
    super(HttpStatus.BAD_REQUEST, CRYPTO_ERROR_GROUP, code, message);
  }
}
