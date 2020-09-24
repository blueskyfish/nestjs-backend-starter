import { DB_ERROR_GROUP, DbService } from './database';
import { IMysqlConfig, MysqlConfig, MysqlService } from './database/mysql';
import { ISqliteConfig, SqliteConfig, SqliteService } from './database/sqlite';
import { LogService } from './log';
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

export function createDatabaseService(config: IMysqlConfig | ISqliteConfig, log: LogService): DbService {
  log.info(DB_ERROR_GROUP, `database type "${config.type}" is usage...`);
  switch (config.type) {
    case 'mysql':
      return new DbService(new MysqlService(log, new MysqlConfig(config)));
    case 'sqlite':
      return new DbService(new SqliteService(log, new SqliteConfig(config)));
    default:
      throw new TypeError('Database type is required');
  }
}
