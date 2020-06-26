import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { ValidUtil } from '../util';
import { VerifierError } from './verifier.error';
import { AuthUser, IAuthData } from '../user/';
import { CryptoService } from '../crypto/crypto.service';

/**
 * parse the string and convert into auth data.
 */
function parseAuthData<AuthData extends IAuthData>(data: string): AuthData {
  try {
    return JSON.parse(data);
  } catch (e) {
    throw new VerifierError('notSupport', 'Token is not support')
  }
}

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
   *
   * @param {string} token the given token
   * @returns {AuthUser} the user
   * @throws VerifierError when failed to create the auth user.
   */
  fromToken<AuthData extends IAuthData>(token: string): AuthUser<AuthData> {

    const authValue = this.decryptToken(token);

    const authData: AuthData = parseAuthData<AuthData>(authValue);

    // All required attributes are exist and valid
    if (!ValidUtil.isPositiv(authData.id) || !_.isArray(authData.roles)
    ) {
      throw new VerifierError('invalid', 'Token data is not valid');
    }

    return new AuthUser<AuthData>(authData);
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

