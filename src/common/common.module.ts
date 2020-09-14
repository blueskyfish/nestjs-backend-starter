import { DynamicModule, Logger, Module } from '@nestjs/common';
import { createDatabaseService, ICommonConfig } from './common.config';
import { DbService } from './database';
import { LogConfig, LogService } from './log';
import { SettingConfig } from './setting/setting.config';
import { SettingService } from './setting/setting.service';

const commonServices: any[] = [
  // Logger <https://docs.nestjs.com/techniques/logger>
  Logger,
  LogService,
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
   * @param {ICommonConfig} config the database connection
   * @returns {DynamicModule}
   */
  static forRoot(config: ICommonConfig): DynamicModule {
    const commonProviders: any[] = [
      {
        provide: DbService,
        inject: [Logger],
        useFactory: (logger: Logger): DbService => createDatabaseService(config.db, logger),
      },
      {
        provide: SettingConfig,
        useValue: new SettingConfig({
          appHome: config.appHome,
        }),
      },
      {
        provide: LogConfig,
        useValue: new LogConfig(config.log),
      },
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
