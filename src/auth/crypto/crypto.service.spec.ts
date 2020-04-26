import { Test, TestingModule } from '@nestjs/testing';
import { CRYPTO_CONFIG } from './crypto.config';
import { cryptoFactory } from './crypto.factory';
import { CryptoService } from './crypto.service';

describe('CryptService', () => {

  let cryptoService: CryptoService = null;

  beforeEach(async () => {

    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: CRYPTO_CONFIG,
          useFactory: async () => await cryptoFactory(priKeyFilename, pubKeyFilename),
        },
      ]
    }).compile();

    cryptoService = app.get<CryptoService>(CryptoService);
  });

  describe('Encrypt & Decrypt', () => {

    it('should encrypt and decrypt "Hello World!"', () => {

      const msg = 'Hello World!';
      const enc = cryptoService.encrypt(msg);
      const value = cryptoService.decrypt(enc);

      expect(value).toBe(value);
    });
  });
})
