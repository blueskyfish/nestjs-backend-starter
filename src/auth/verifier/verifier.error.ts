import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/error';

export const VERIFIER_ERROR_GROUP = 'verifier';

/**
 * An authorization error message
 */
export class VerifierError extends CommonError {

  constructor(code: string, message: string) {
    super(HttpStatus.UNAUTHORIZED, VERIFIER_ERROR_GROUP, code, message);
  }
}

