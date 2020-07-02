import { Test, TestingModule } from '@nestjs/testing';
import { CryptoConfig } from '../crypto/crypto.config';
import { cryptoFactory } from '../crypto/crypto.factory';
import { CryptoService } from '../crypto/crypto.service';
import { PasswordService } from './password.service';

describe('Password Service', () => {

  let app: TestingModule = null;
  let passwordService: PasswordService = null;

  beforeEach(async () => {

    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    app = await Test.createTestingModule({
      providers: [
        CryptoService,
        PasswordService,
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

    passwordService = app.get(PasswordService);
  });

  afterAll(async () => await app.close());

  describe('password and check password', () => {

    it('should check the password', () => {

      const password = 'SaltedStars234!!';

      const hash = passwordService.generatePassword(password);

      // console.log('Password =>', hash);

      expect(hash).not.toBeNull();
      expect(passwordService.checkPassword(hash, password)).toBeTruthy();
    });

  });

});
