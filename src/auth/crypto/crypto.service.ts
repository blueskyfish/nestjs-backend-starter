import { Injectable } from '@nestjs/common';
import { createHash, privateEncrypt, publicDecrypt } from 'crypto';
import { RequiredError } from '../../common/error';
import { ENCODE_HEX, ENCODE_UTF, HASH_FUNC, ValidUtil } from '../util';
import { CryptoConfig } from './crypto.config';


/**
 * The crypto service encrypt and decrypt string with the public- and private key.
 */
@Injectable()
export class CryptoService {

  constructor(private config: CryptoConfig) {}

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

  /**
   * Generates the hashed password with a given prefix and palin password.
   *
   * @param {string} prefix the prefix
   * @param {string} password the plain password
   * @returns {string} the hashed password
   * @throws RequiredError if one of parameters is invalid
   */
  digest(prefix: string, password: string): string {

    if(!ValidUtil.notEmpty(prefix)) {
      throw new RequiredError('prefix', 'digest requires parameter "prefix"');
    }
    if (!ValidUtil.notEmpty(password)) {
      throw new RequiredError('password', 'digest requires parameter "password"')
    }

    const value = `${this.config.digestSecret}${prefix}${password}`;

    return createHash(HASH_FUNC).update(value).digest(ENCODE_HEX);
  }

  /**
   * Verify the password hash with the plain password
   *
   * @param {string} passwordHash the hashed password
   * @param {string} prefix the prefix of the password hash
   * @param {string} password the plain password
   * @returns {boolean} `true` means the password is equals
   * @throws RequiredError if one of the parameters is invalid
   */
  verify(passwordHash: string, prefix: string, password: string): boolean {
    const hashedPassword = this.digest(prefix, password);
    return passwordHash === hashedPassword;
  }
}
