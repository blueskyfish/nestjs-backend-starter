import { Test, TestingModule } from '@nestjs/testing';
import { SecondUtil } from '../../common/util';
import { CRYPTO_CONFIG } from '../crypto';
import { cryptoFactory } from '../crypto/crypto.factory';
import { CryptoService } from '../crypto/crypto.service';
import { TOKEN_CONFIG, TokenConfig } from './token.config';
import { TokenService } from './token.service';

describe('KeeperService', () => {

  let keeperService: TokenService = null;

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
        },
        {
          provide: TOKEN_CONFIG,
          useValue: new TokenConfig(SecondUtil.fromMinutes(1)),
        }
      ]
    }).compile();

    keeperService = app.get(TokenService);

  });

  describe('Create Token "from"', () => {

    it('should return "token"', () => {
      const token = keeperService.from(4711, 2349123, ['admin', 'reader', 'backup']);
      expect(token).not.toBeNull();
    });

  })
});
