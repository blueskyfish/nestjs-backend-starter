import { Test, TestingModule } from '@nestjs/testing';
import { CryptoConfig } from '../crypto/crypto.config';
import { cryptoFactory } from '../crypto/crypto.factory';
import { CryptoService } from '../crypto/crypto.service';
import { TokenError } from './token.error';
import { TokenService } from './token.service';

describe('KeeperService', () => {

  let app: TestingModule = null;
  let tokenService: TokenService = null;

  beforeEach(async () => {
    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    app = await Test.createTestingModule({
      providers: [
        CryptoService,
        TokenService,
        {
          provide: CryptoConfig,
          useFactory: async () => await cryptoFactory(
            priKeyFilename,
            pubKeyFilename,
            'ABC123'
          ),
        }
      ]
    }).compile();

    tokenService = app.get(TokenService);
  });

  afterAll(async () => await app.close());

  describe('Create Token "from"', () => {

    it('should return "token"', () => {
      const token = tokenService.from(4711, ['admin', 'reader', 'backup']);
      expect(token).not.toBeNull();
    });

    it('should return "token" with extension', () => {
      const authUser = {
        id: 4711,
        roles: ['test'],
        data: 'test'
      };

      const token = tokenService.fromAuth(authUser);
      // console.info(`Token: ${token}`);
      expect(token).not.toBeNull();
    });

  });

  describe('Error cases', () => {

    it('should throw an error because missing required attributes: part 1', () => {

      expect(() => {
        tokenService.fromAuth({});
      }).toThrow(TokenError);
    });

    it('should throw an error because missing required attributes: part 2', () => {
      expect(() => {
        tokenService.fromAuth<{id: number, roles: string[], data: string}>({ id: 4711, data: 'test'});
      }).toThrow(TokenError);
    });
  });
});
