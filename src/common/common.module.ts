import { DynamicModule, Module } from '@nestjs/common';
import { DB_CONFIG_TOKEN, DbConfig, DbService, IDbConfig } from './database';
import { DbMiddleware } from './database/db.middleware';

const services: any[] = [
  DbService,
  DbMiddleware,
];


/**
 * Common module for the database services, middlewares and other utility classes.
 *
 * **NOTE**: This module is global. Only import **once** in the backend at the {@link AppModule}.
 */
@Module({})
export class AppCommonModule {

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
