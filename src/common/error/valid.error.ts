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
 *
 * ```json
 * {
 *     "method": "GET",
 *     "url": "/test",
 *     "group": "validate",
 *     "code": "parameters",
 *     "message": "Entities with validation errors",
 *     "stack": [
 *         "validate.parameters: Entities with validation errors",
 *         "    at ValidationPipe.exceptionFactory (/Users/sarah/Projects/blueskyfish/github/nestjs-backend-starter/dist/main.js:27:20)",
 *         "    at async /Users/sarah/Projects/blueskyfish/github/nestjs-backend-starter/node_modules/@nestjs/core/router/router-proxy.js:8:17"
 *     ],
 *     "data": {
 *         "errors": {
 *             "property": [
 *                 "property: message"
 *             ],
 *         }
 *     }
 * }
 * ```
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
