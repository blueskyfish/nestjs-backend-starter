import { DynamicModule, Module } from '@nestjs/common';
import { IAuthConfig } from './auth.config';
import { CryptoConfig } from './crypto/crypto.config';
import { cryptoFactory } from './crypto/crypto.factory';
import { CryptoService } from './crypto/crypto.service';
import { PasswordService } from './password';
import { TokenService } from './token';
import { AuthMiddleware } from './user';
import { VerifierService } from './verifier';

// Services for internal usage
const authInternalServices: any[] = [
  CryptoService,
];

// Services for global usage
const authServices: any[] = [
  AuthMiddleware,
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
          provide: CryptoConfig,
          useFactory: async () => await cryptoFactory(
            config.priKeyFilename,
            config.pubKeyFilename,
            config.digestSecret
          ),
        },
        ...authInternalServices,
        ...authServices
      ],
      exports: [
        ...authServices,
      ]
    };
  }
}
