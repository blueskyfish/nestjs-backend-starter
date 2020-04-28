import { Injectable } from '@nestjs/common';
import { DbConnection } from '../../common/database';
import { LoginPayload, LoginUser } from '../entities';
import { NotImplementedError } from '../errors';

@Injectable()
export class UserService {

  /**
   * Login the user with his credentials `email` and `password`.
   *
   * @param {DbConnection} conn the database connection
   * @param {LoginPayload} payload the payload data from sent from user
   * @returns {Promise<LoginUser>} in case of success it sends back the user information with authentication.
   * @throws NotImplementedError
   */
  async login(conn: DbConnection, payload: LoginPayload): Promise<LoginUser> {
    throw new NotImplementedError('user login is not ready');
  }
}
