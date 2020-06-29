import * as _ from 'lodash';
import { BootstrapError } from '../../common/error';
import { readKey } from '../util';
import { CryptoConfig } from './crypto.config';

/**
 * A factory function for read the public- and private keys
 *
 * @param priKeyFilename the filename of the private key
 * @param pubKeyFilename the filename of the public key
 * @param digestSecret the digest secret
 * @returns {Promise<CryptoConfig>}
 */
export async function cryptoFactory(
  priKeyFilename: string, pubKeyFilename: string, digestSecret: string): Promise<CryptoConfig> {

  const privateKey = await readKey(priKeyFilename);
  const publicKey = await readKey(pubKeyFilename);

  if (_.isNil(digestSecret)) {
    throw new BootstrapError('DIGEST_SECRET', 'Missing environment "DIGEST_SECRET"');
  }

  return new CryptoConfig(publicKey, privateKey, digestSecret);
}
