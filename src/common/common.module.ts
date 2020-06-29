import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ICommonConfig } from './common.config';
import { DbConfig, DbService } from './database';
import { SettingConfig } from './setting/setting.config';
import { SettingService } from './setting/setting.service';

const commonServices: any[] = [
  // Logger <https://docs.nestjs.com/techniques/logger>
  Logger,

  DbService,
  SettingService,
];


/**
 * Common module for the database services, middlewares and other utility classes.
 *
 * **NOTE**: This module is global. Only import **once** in the backend at the {@link AppModule}.
 */
@Module({})
export class AppCommonModule {
  // TODO: "App" => Rename the shortcut with your project specifications

  /**
   * Add the database configuration and provides the services.
   *
   * @param {IDbConfig} config the database connection
   * @returns {DynamicModule}
   */
  static forRoot(config: ICommonConfig): DynamicModule {

    const commonProviders: any[] = [
      {
        provide: DbConfig,
        useValue: new DbConfig(config),
      },
      {
        provide: SettingConfig,
        useValue: new SettingConfig(config),
      }
    ];

    return {
      global: true,
      module: AppCommonModule,
      providers: [
        ...commonProviders,
        ...commonServices,
      ],
      exports: [
        ...commonProviders,
        ...commonServices,
      ],
    };
  }
}
