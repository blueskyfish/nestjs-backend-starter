import * as _ from 'lodash';
import { readKey } from '../util';
import { CryptoKeys } from './crypto.config';

const REG_BEGIN = /-----BEGIN.+-----/;
const REG_END = /-----END.+-----/
/**
 * A factory function for read the public- and private keys
 *
 * @param priKeyFilename the filename of the private key
 * @param pubKeyFilename the filename of the public key
 * @returns {Promise<CryptoKeys>}
 */
export async function cryptoFactory(priKeyFilename: string, pubKeyFilename: string): Promise<CryptoKeys> {

  const privateKey = await readKey(priKeyFilename);
  const publicKey = await readKey(pubKeyFilename);

  // use the private key also as salt for the password hash
  const passwordSalt = privateKey
    .replace(REG_BEGIN, '')
    .replace(REG_END, '')
    .replace('\r', '')
    .split('\n')
    .filter(line => _.size(line) > 0)
    .join('');

  return new CryptoKeys(publicKey, privateKey, passwordSalt);
}
