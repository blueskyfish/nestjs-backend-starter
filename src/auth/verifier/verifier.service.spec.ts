import { Test, TestingModule } from '@nestjs/testing';
import { CryptoConfig } from '../crypto/crypto.config';
import { cryptoFactory } from '../crypto/crypto.factory';
import { CryptoService } from '../crypto/crypto.service';
import { VerifierError } from './verifier.error';
import { VerifierService } from './verifier.service';
import { TokenService } from '../token';


describe('VerifierService', () => {

  let app: TestingModule = null;
  let tokenService: TokenService = null;
  let verifierService: VerifierService = null;

  beforeAll(async () => {

    const priKeyFilename = 'test-private.pem';
    const pubKeyFilename = 'test-public.pem';

    app = await Test.createTestingModule({
      providers: [
        CryptoService,
        TokenService,
        VerifierService,
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
    verifierService = app.get(VerifierService);

  });

  afterAll(async () => await app.close());

  describe('Encrypt Token', () => {

    let token: string = null;

    beforeEach(() => {

      token = tokenService.from(4711, ['admin', 'reader', 'backup']);

    });

    it('should return "AuthUser"', () => {

      const authUser = verifierService.fromToken(token);
      expect(authUser).not.toBeNull();
      expect(authUser.id).toEqual(4711);
      expect(authUser.hasRole('admin')).toBeTruthy();
      expect(authUser.hasRole('test')).toBeFalsy();
    });

    it('should run into "notFound" exception with null', () => {
      expect(() => {
        verifierService.fromToken(null);
      }).toThrowError(VerifierError);
    });

    it('should run into "notFound" exception with invalid token', () => {
      expect(() => {
        verifierService.fromToken(token.substring(3));
      }).toThrowError(VerifierError);
    });

  });

  describe('Extends Auth User', () => {

    it('should tokenized and verified extends auth data', () => {

      const authData = {
        id: 4711,
        roles: ['test'],
        data: 'hello world',
      };

      const token = tokenService.fromAuth(authData);

      const authUser = verifierService.fromToken<{id: number, roles: string[], data: string}>(token);

      expect(authUser).not.toBeNull();
      expect(authUser.id).toEqual(4711);
      expect(authUser.hasRole('test')).toBeTruthy();
      expect(authUser.hasRole('admin')).toBeFalsy();

      expect(authUser.data.data).toEqual('hello world');
    })
  })

});
