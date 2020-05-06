import { DynamicModule, Module } from '@nestjs/common';
import { IBusinessConfig } from './business.config';
import { BusinessService } from './business.service';
import { BusinessSettings } from './business.settings';
import { AuthMiddleware, AuthUserService } from './middleware';
import { NameGeneratorService } from './service';
import { UserService } from './user';

// Here are the service for global using in other modules
const globalServices: any[] = [
  UserService,
  AuthMiddleware,
  AuthUserService,
  NameGeneratorService,
];

// Her are only services for internal using.
const internalServices: any[] = [
  BusinessService,
];

@Module({
})
export class AppBusinessModule {
  // TODO: "App" => Rename the shortcut with your project specifications

  /**
   * Register the business module. It is global and import only in the AppModule.
   *
   * @param {IBusinessConfig} config
   * @returns {DynamicModule}
   */
  static forRoot(config: IBusinessConfig): DynamicModule {

    const exportProviders: any[] = [
      {
        provide: BusinessSettings,
        useValue: new BusinessSettings(config),
      }
    ];

    return {
      global: true,
      module: AppBusinessModule,
      providers: [
        ...exportProviders,
        ...internalServices,
        ...globalServices,
      ],
      exports: [
        ...exportProviders,
        ...globalServices,
      ]
    };
  }

}
