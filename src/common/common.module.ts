import { DynamicModule, Logger, Module } from '@nestjs/common';
import { DbConfig, DbService, IDbConfig } from './database';

const commonServices: any[] = [
  // Logger <https://docs.nestjs.com/techniques/logger>
  Logger,

  DbService,
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
  static forRoot(config: IDbConfig): DynamicModule {

    const providers: any[] = [
      {
        provide: DbConfig,
        useValue: new DbConfig(config),
      },
    ];

    return {
      global: true,
      module: AppCommonModule,
      providers: [
        ...providers,
        ...commonServices,
      ],
      exports: [
        ...providers,
        ...commonServices,
      ],
    };
  }
}
