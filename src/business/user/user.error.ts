import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/error';

/**
 * The user error group
 */
export const USER_ERROR_GROUP = 'user';

/**
 * Error with user context
 */
export class UserError extends CommonError {

  constructor(code: string, message: string, data?: any) {
    super(HttpStatus.BAD_REQUEST, USER_ERROR_GROUP, code, message, data);
  }

  static mailAlreadyUse(): UserError {
    return new UserError('existEmail', 'Email is already in usage');
  }

  static registerFailed (): UserError {
    return new UserError('register', 'Register the user is failed');
  }

  static notFound(): UserError {
    return new UserError('notFound', 'User is not found');
  }
}
