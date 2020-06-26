import { Test, TestingModule } from '@nestjs/testing';
import { CryptoConfig } from '../crypto';
import { cryptoFactory } from '../crypto/crypto.factory';
import { CryptoService } from '../crypto/crypto.service';
import { PasswordService } from './password.service';

describe('Password Service', () => {

  let passwordService: PasswordService = null;

  beforeEach(async () => {

    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        PasswordService,
        {
          provide: CryptoConfig,
          useFactory: async () => await cryptoFactory(priKeyFilename, pubKeyFilename),
        },
      ]
    }).compile();

    passwordService = app.get(PasswordService);
  });

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
