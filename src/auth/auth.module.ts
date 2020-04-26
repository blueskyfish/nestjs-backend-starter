import { DynamicModule, Module, Provider } from '@nestjs/common';
import { IAuthConfig } from './auth.config';
import { CRYPTO_CONFIG } from './crypto';
import { cryptoFactory } from './crypto/crypto.factory';
import { CryptoService } from './crypto/crypto.service';
import { TOKEN_CONFIG, TokenService } from './token';
import { tokenConfigFactory } from './token/token.config.factory';
import { VerifierService } from './verifier';
import { AUTH_MIDDLEWARE_CONFIG, AuthMiddlewareConfig, AuthMiddlewareService } from './web';

// Services for internal usage
const internalServices: any[] = [
  CryptoService,
];

// Services for global usage
const services: any[] = [
  AuthMiddlewareService,
  VerifierService,
  TokenService,
];

/**
 * Authorization and Authentication.
 */
@Module({})
export class AppAuthModule {
  // TODO: "App" => Rename the shortcut with your project specifications

  static forRoot(config: IAuthConfig): DynamicModule {

    // configuration providers for export
    const exportedProvider: Provider[] = [
      {
        provide: AUTH_MIDDLEWARE_CONFIG,
        useValue: new AuthMiddlewareConfig(config.headerName),
      }
    ]

    return {
      global: true,
      module: AppAuthModule,
      providers: [
        {
          provide: CRYPTO_CONFIG,
          useFactory: async () => await cryptoFactory(config.priKeyFilename, config.pubKeyFilename),
        },
        {
          provide: TOKEN_CONFIG,
          useValue: tokenConfigFactory(config.expires),
        },
        ...exportedProvider,
        ...internalServices,
        ...services
      ],
      exports: [
        ...exportedProvider,
        ...services,
      ]
    };
  }
}
