import { HttpStatus, ValidationError } from '@nestjs/common';
import { CommonError } from './common.error';

export const VALID_ERROR_GROUP = 'validate';
export const VALID_ERROR_CODE = 'parameters';
export const VALID_ERROR_MESSAGE = 'Entities with validation errors';

export class ValidError extends CommonError {

  constructor(errors: ValidationError[]) {
    super(HttpStatus.BAD_REQUEST, VALID_ERROR_GROUP, VALID_ERROR_CODE, VALID_ERROR_MESSAGE, {
      errors
    });
  }
}
