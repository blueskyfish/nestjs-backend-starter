import { DynamicModule, Logger, Module } from '@nestjs/common';
import { createDatabaseService, ICommonConfig } from './common.config';
import { DbService } from './database';
import { LogService } from './log';
import { SettingConfig } from './setting/setting.config';
import { SettingService } from './setting/setting.service';
import { StageService } from './stage';

const commonServices: any[] = [
  // Logger <https://docs.nestjs.com/techniques/logger>
  Logger,
  LogService,
  StageService,
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
        inject: [LogService],
        useFactory: (log: LogService): DbService => createDatabaseService(config.db, log),
      },
      {
        provide: SettingConfig,
        useValue: new SettingConfig({
          appHome: config.appHome,
        }),
      },
    ];

    return {
      global: true,
      module: AppCommonModule,
      providers: [
        ...commonServices,
        ...commonProviders,
      ],
      exports: [
        ...commonServices,
        ...commonProviders,
      ],
    };
  }
}
