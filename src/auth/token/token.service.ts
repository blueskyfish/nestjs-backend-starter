import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { IAuthData } from '../user';
import { CryptoService } from '../crypto/crypto.service';
import { ValidUtil } from '../util';
import { TokenError } from './token.error';

/**
 * Create the token from the given auth data.
 *
 * **Errors**
 *
 * | Code                      | Description
 * |---------------------------|---------------------------------------------------------------
 * | `token.notCreatable`     | The token is not able to create from auth data
 * | `token.notSupport`       | The format of the auth data is not support
 */
@Injectable()
export class TokenService {

  constructor(private cryptoService: CryptoService) {
  }

  /**
   * Create the token from the auth data. Only the attributes `id` and `roles` are required.
   *
   * @param {Partial<IAuthData>} authData the partial auth data
   * @returns {string} the token
   * @throws TokenError
   */
  fromAuth<AuthData extends IAuthData>(authData: Partial<AuthData>): string {

    if (!ValidUtil.isPositiv(authData.id) || !_.isArray(authData.roles)) {
      throw new TokenError('notSupport', 'The auth data is not support');
    }

    const authValue = JSON.stringify(authData);

    try {
      return this.cryptoService.encrypt(authValue);
    } catch (e) {
      throw new TokenError('notCreatable', 'Token is not creatable')
    }
  }

  /**
   * Create the token from given `id`, `device` and `roles` array.
   *
   * @param {number} id the user id
   * @param {string[]} roles the array with the roles
   * @returns {string} the token
   * @throws TokenError
   */
  from(id: number, roles: string[]): string {
    return this.fromAuth({id, roles});
  }
}

