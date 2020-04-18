import { HttpStatus, ValidationError } from '@nestjs/common';

import { CommonError } from './common.error';

export const VALID_ERROR_GROUP = 'validate';
export const VALID_ERROR_CODE = 'parameters';
export const VALID_ERROR_MESSAGE = 'Entities with validation errors';

/**
 * The error messages information
 */
export interface IErrorMessages {
  [property: string]: string[];
}

/**
 * The Validation Error class for an invalid data object
 */
export class ValidError extends CommonError {

  constructor(errors: ValidationError[]) {
    super(HttpStatus.BAD_REQUEST, VALID_ERROR_GROUP, VALID_ERROR_CODE, VALID_ERROR_MESSAGE, {
      errors: buildErrorMessages(errors),
    });
  }
}

/**
 * Build the error messages from the given list of `ValidationError` and build an map with the affected attributes
 *
 * @param {ValidationError[]} errors the list of errors
 * @returns {IErrorMessages} an error message instance
 */
const buildErrorMessages = (errors: ValidationError[]): IErrorMessages => {
  const errorMsg: IErrorMessages = {};

  errors.forEach((e: ValidationError) => {
    errorMsg[e.property] = Object.keys(e.constraints).map(property => `${property}: ${e.constraints[property]}`);
  });

  return errorMsg;
}
