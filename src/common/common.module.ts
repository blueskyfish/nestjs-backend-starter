import { DynamicModule, Module } from '@nestjs/common';
import { DbConfig, DbService, IDbConfig } from './database';

const services: any[] = [
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
    return {
      global: true,
      module: AppCommonModule,
      providers: [
        {
          provide: DbConfig,
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
