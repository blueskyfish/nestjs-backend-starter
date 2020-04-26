import { DynamicModule, Module } from '@nestjs/common';
import { DB_CONFIG_TOKEN, DbConfig, DbService, IDbConfig } from './database';
import { DbMiddleware } from './database/db.middleware';
import { RequestFinishMiddleware } from './middleware';

const services: any[] = [
  DbService,
  DbMiddleware,
  RequestFinishMiddleware,
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
    return {
      global: true,
      module: AppCommonModule,
      providers: [
        {
          provide: DB_CONFIG_TOKEN,
          useValue: new DbConfig(config),
        },
        ...services,
      ],
      exports: [
        ...services,
      ],
    };
  }
}
