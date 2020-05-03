import { DynamicModule, Module } from '@nestjs/common';
import { IAuthConfig } from './auth.config';
import { CRYPTO_CONFIG } from './crypto';
import { cryptoFactory } from './crypto/crypto.factory';
import { CryptoService } from './crypto/crypto.service';
import { PasswordService } from './password';
import { TokenService } from './token';
import { VerifierService } from './verifier';

// Services for internal usage
const internalServices: any[] = [
  CryptoService,
];

// Services for global usage
const services: any[] = [
  PasswordService,
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

    return {
      global: true,
      module: AppAuthModule,
      providers: [
        {
          provide: CRYPTO_CONFIG,
          useFactory: async () => await cryptoFactory(config.priKeyFilename, config.pubKeyFilename),
        },
        ...internalServices,
        ...services
      ],
      exports: [
        ...services,
      ]
    };
  }
}
