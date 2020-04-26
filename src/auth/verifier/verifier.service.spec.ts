import { Test, TestingModule } from '@nestjs/testing';
import { CRYPTO_CONFIG } from '../crypto';
import { cryptoFactory } from '../crypto/crypto.factory';
import { CryptoService } from '../crypto/crypto.service';
import { VerifierError } from './verifier.error';
import { VerifierService } from './verifier.service';
import { TOKEN_CONFIG, TokenConfig } from '../token/token.config';
import { TokenService } from '../token/token.service';

const sleep = async (seconds: number): Promise<void> => {
  return new Promise((resolve => {
    setTimeout(() => resolve(), seconds * 1000);
  }));
}

jest.setTimeout(40*1000);

describe('VerifierService', () => {

  let keeperService: TokenService = null;
  let authService: VerifierService = null;

  beforeEach(async () => {

    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        TokenService,
        VerifierService,
        {
          provide: CRYPTO_CONFIG,
          useFactory: async () => await cryptoFactory(priKeyFilename, pubKeyFilename),
        },
        {
          provide: TOKEN_CONFIG,
          useValue: new TokenConfig(5), // 5 seconds expires
        }
      ]
    }).compile();

    keeperService = app.get(TokenService);
    authService = app.get(VerifierService);

  });

  describe('Encrypt Token', () => {

    let token: string = null;

    beforeEach(() => {

      token = keeperService.from(4711, 23456, ['admin', 'reader', 'backup']);

    });

    it('should return "AuthUser"', () => {

      const authUser = authService.fromToken(token);
      expect(authUser).not.toBeNull();
      expect(authUser.id).toEqual(4711);
      expect(authUser.hasRole('admin')).toBeTruthy();
      expect(authUser.hasRole('test')).toBeFalsy();
    });

    it('should run into "expires" exception', async () => {

      await sleep(7);

      expect(() => {
        authService.fromToken(token);
      }).toThrowError(VerifierError);
    });

    it('should run into "notFound" exception with null', () => {
      expect(() => {
        authService.fromToken(null);
      }).toThrowError(VerifierError);
    });

    it('should run into "notFound" exception with invalid token', () => {
      expect(() => {
        authService.fromToken(token.substring(3));
      }).toThrowError(VerifierError);
    });

  });

});
