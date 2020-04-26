import { readKey } from '../util';
import { CryptoKeys } from './crypto.config';

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

  return new CryptoKeys(publicKey, privateKey);
}
