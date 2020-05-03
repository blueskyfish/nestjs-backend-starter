import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/error';

/**
 * A small exception for endpoints that are not implemented yet!
 */
export class NotImplementedError extends CommonError {

  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, 'system', 'notImplement', message);
  }
}
