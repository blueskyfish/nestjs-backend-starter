import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { SecondUtil } from '../../common/util';
import { ValidUtil } from '../util';
import { VerifierError } from './verifier.error';
import { AuthUser, IAuthData } from '../auth.user';
import { CryptoService } from '../crypto/crypto.service';

/**
 * Verifier from the token and create the {@link AuthUser} in case of success.
 *
 * **Errors**
 *
 * | Code                  | Description
 * |-----------------------|---------------------------------------------------------------
 * | `verifier.notFound`   | The token is not able to decrypt
 * | `verifier.notSupport` | The token contains not a supported JSON object.
 * | `verifier.invalid`    | The auth user is not validate. It missing some attributes
 * | `verifier.expires`    | The auth user timeout is reaching.
 */
@Injectable()
export class VerifierService {

  constructor(private cryptoService: CryptoService) {
  }

  /**
   * Get the auth user from the token.
   * @param {string} token the given token
   * @returns {AuthUser} the user
   * @throws VerifierError when failed to create the auth user.
   */
  fromToken(token: string): AuthUser {
    const authValue = this.decryptToken(token);

    const authData = parseAuthData(authValue);

    // All required attributes are exist and valid
    if (
      !ValidUtil.isPositiv(authData.id) || !ValidUtil.isPositiv(authData.device) ||
      _.isNil(authData.roles) && !_.isArray(authData.roles)
    ) {
      throw new VerifierError('invalid', 'Token data is not valid');
    }

    return new AuthUser(authData);
  }

  // Decrypt the token into string
  private decryptToken(token: string): string {
    try {
      return this.cryptoService.decrypt(token);
    } catch (e) {
      throw new VerifierError('notFound', 'Token is not found');
    }
  }
}

// parse the string and convert into auth data.
const parseAuthData = (data: string): IAuthData => {
  try {
    return JSON.parse(data);
  } catch (e) {
    throw new VerifierError('notSupport', 'Token is not support')
  }
}
