import { Inject, Injectable } from '@nestjs/common';
import { privateEncrypt, publicDecrypt } from 'crypto';
import { ENCODE_HEX, ENCODE_UTF } from '../util';
import { CRYPTO_CONFIG, CryptoKeys } from './crypto.config';


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

}
