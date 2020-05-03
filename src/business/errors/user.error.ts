import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/error';

export const USER_ERROR_GROUP = 'user';

export class UserError extends CommonError {

  constructor(code: string, message: string, data?: any) {
    super(HttpStatus.BAD_REQUEST, USER_ERROR_GROUP, code, message, data);
  }
}

export const mailAlreadyUse = (): UserError => {
  return new UserError('existEmail', 'Email is already in usage');
};

export const registerUserFailed = (): UserError => {
  return new UserError('register', 'Register the user is failed');
};

export const notFoundUser = (): UserError => {
  return new UserError('notFound', 'User is not found');
};
