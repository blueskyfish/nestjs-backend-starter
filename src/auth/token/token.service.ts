import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { IAuthData } from '../auth.user';
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
   * Create the token from the auth data. Only the attributes `id`, `device` and `roles` are required.
   *
   * @param {Partial<IAuthData>} template the partial auth data
   * @returns {string} the token
   * @throws TokenError
   */
  fromAuth(template: Partial<IAuthData>): string {

    validateTemplate(template);

    const authData: IAuthData = {
      id: template.id,
      device: template.device,
      roles: [...template.roles],
    };

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
   * @param {number} device the id of the device
   * @param {string[]} roles the array with the roles
   * @returns {string} the token
   * @throws TokenError
   */
  from(id: number, device: number, roles: string[]): string {
    return this.fromAuth({id, device, roles});
  }
}

// validate the required part of the auth data
const validateTemplate = (authData: Partial<IAuthData>): void => {
  if (!ValidUtil.isPositiv(authData.id) ||
    !ValidUtil.isPositiv(authData.device) ||
    _.isNil(authData.roles) ||
    !_.isArray(authData.roles))
  {
    throw new TokenError('notSupport', 'The auth data is not support');
  }
}
