import { Inject, Injectable } from '@nestjs/common';
import { createHash, privateEncrypt, publicDecrypt } from 'crypto';
import { ENCODE_HEX, ENCODE_UTF, ValidUtil } from '../util';
import { CRYPTO_CONFIG, CryptoKeys } from './crypto.config';
import { CryptoError } from './crypto.error';


/**
 * The crypto service encrypt and decrypt string with the public- and private key.
 */
@Injectable()
export class CryptoService {

  constructor(@Inject(CRYPTO_CONFIG) private config: CryptoKeys) {}

  /**
   * Encrypt the given value with the private key and returns as `hex` string.
   *
   * @param {string} value the value
   * @returns {string} the `hex` string
   */
  encrypt(value: string): string {
    const buffered = Buffer.from(value, ENCODE_UTF);
    return privateEncrypt(this.config.privateKey, buffered).toString(ENCODE_HEX);
  }

  /**
   * Decrypt the given `hex` value with the public key and returns the plain text.
   *
   * @param {string} value
   * @returns {string}
   */
  decrypt(value: string): string {
    const buffered = Buffer.from(value, ENCODE_HEX);
    return publicDecrypt(this.config.publicKey, buffered).toString(ENCODE_UTF);
  }

  digest(prefix: string, password: string): string {

    if(!ValidUtil.notEmpty(prefix) || !ValidUtil.notEmpty(password)) {
      throw new CryptoError('required', 'The parameters are required');
    }

    const value = `${this.config.passwordSalt}${prefix}${password}`;

    return createHash('sha256').update(value).digest(ENCODE_HEX);
  }

  verify(passwordHash: string, prefix: string, password: string): boolean {

    if (!ValidUtil.notEmpty(password)) {
      throw new CryptoError('required', 'The parameters are required');
    }

    const hashedPassword = this.digest(prefix, password);

    return passwordHash === hashedPassword;
  }
}
