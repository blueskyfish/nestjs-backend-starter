import { HttpStatus } from '@nestjs/common';

/**
 * Base error for all business errors
 */
export class CommonError extends Error {

  get name(): string {
    return `${this.group}.${this.code}`;
  };

  /**
   * The constructor for the common error
   * @param {number} statusCode the error status code. see {@link HttpStatus}
   * @param {string} group the group of errors
   * @param {string} code the error code. It is a short value with lower case signs without whitepsaces
   * @param {string} message a long description
   * @param {*} [data] an optional data property
   */
  constructor(
    public readonly statusCode: HttpStatus,
    public readonly group: string,
    public readonly code: string,
    message: string,
    public readonly data?: any,
  ) {
    super(message);
  }
}
