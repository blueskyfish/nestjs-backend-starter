import { Test, TestingModule } from '@nestjs/testing';
import { RequiredError } from '../../common/error';
import { CryptoConfig } from './crypto.config';
import { cryptoFactory } from './crypto.factory';
import { CryptoService } from './crypto.service';

describe('CryptService', () => {

  let app: TestingModule = null;
  let cryptoService: CryptoService = null;

  beforeEach(async () => {

    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    app = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: CryptoConfig,
          useFactory: async () => await cryptoFactory(
            priKeyFilename,
            pubKeyFilename,
            'ABC123'
          ),
        },
      ]
    }).compile();

    cryptoService = app.get<CryptoService>(CryptoService);
  });

  afterAll(async () => await app.close());

  describe('Encrypt & Decrypt', () => {

    it('should encrypt and decrypt "Hello World!"', () => {

      const msg = 'Hello World!';
      const enc = cryptoService.encrypt(msg);
      const value = cryptoService.decrypt(enc);

      expect(value).toBe(value);
    });
  });

  describe('Hash Password', () => {

    it('should digest an password with salt', () => {
      const passwordHash = cryptoService.digest('ABCDEFG..XYZ', 'MorningStar1234%');

      expect(passwordHash).not.toBeNull();
      expect(passwordHash.length).toBe(64);

      expect(cryptoService.verify(passwordHash, 'ABCDEFG..XYZ', 'MorningStar1234%')).toBeTruthy();

      // console.log('> Hash Password =>', passwordHash);
    });

    it('should thrown an error with "null" value', () => {
      expect(() => {
        cryptoService.digest(null, 'abc');
      }).toThrow(RequiredError);
    })
  })
})
