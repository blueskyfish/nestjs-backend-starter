import { Logger } from '@nestjs/common';
import { DB_ERROR_GROUP, DbService } from './database';
import { IMysqlConfig, MysqlConfig, MysqlService } from './database/mysql';
import { ISqliteConfig, SqliteConfig, SqliteService } from './database/sqlite';
import { ISettingConfig } from './setting/setting.config';

/**
 * The configuration for the database and other services
 */
export interface ICommonConfig extends ISettingConfig {

  /**
   * The database configuration.
   */
  db: IMysqlConfig | ISqliteConfig;
}

export function createDatabaseService(config: IMysqlConfig | ISqliteConfig, logger: Logger): DbService {
  logger.log(`database type "${config.type}" is usage...`, DB_ERROR_GROUP);
  switch (config.type) {
    case 'mysql':
      return new DbService(new MysqlService(logger, new MysqlConfig(config)));
    case 'sqlite':
      return new DbService(new SqliteService(logger, new SqliteConfig(config)));
    default:
      throw new TypeError('Database type is required');
  }
}
