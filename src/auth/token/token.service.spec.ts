import { Test, TestingModule } from '@nestjs/testing';
import { TimeUtil } from '../../common/util';
import { CRYPTO_CONFIG } from '../crypto';
import { cryptoFactory } from '../crypto/crypto.factory';
import { CryptoService } from '../crypto/crypto.service';
import { TokenService } from './token.service';

describe('KeeperService', () => {

  let tokenService: TokenService = null;

  beforeEach(async () => {
    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        TokenService,
        {
          provide: CRYPTO_CONFIG,
          useFactory: async () => await cryptoFactory(priKeyFilename, pubKeyFilename),
        }
      ]
    }).compile();

    tokenService = app.get(TokenService);

  });

  describe('Create Token "from"', () => {

    it('should return "token"', () => {
      const token = tokenService.from(4711, 2349123, ['admin', 'reader', 'backup']);
      expect(token).not.toBeNull();
    });

  })
});
