import { CryptoConfig } from './crypto.config';
import { cryptoFactory } from './crypto.factory';

const priKeyFilename = 'test-private.pem';
const pubKeyFilename = 'test-public.pem';

describe('CryptoConfig', () => {

  it('should contains keys', async () => {
    const cryptoKeys = await cryptoFactory(priKeyFilename, pubKeyFilename);

    expect(cryptoKeys).not.toBeNull();

    expect(cryptoKeys.privateKey).toContain('-----BEGIN RSA PRIVATE KEY-----');
    expect(cryptoKeys.publicKey).toContain('-----BEGIN PUBLIC KEY-----');

    expect(cryptoKeys.passwordSalt).not.toBeNull();
    expect(cryptoKeys.passwordSalt).not.toContain('\n');
  });
})
