import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { createPool, MysqlError, Pool } from 'mysql';
import { DB_CONFIG_TOKEN, DbConfig, NL, NULL_VALUE } from './db.config';
import { DbConnection } from './db.connection';

/**
 * Manages the database connection pool
 */
@Injectable()
export class DbService implements OnApplicationShutdown {

  private readonly _pool: Pool;

  constructor(@Inject(DB_CONFIG_TOKEN) private config: DbConfig) {
    this._pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: config.connectLimit,

      queryFormat: (query, values) => {
        if (!values) {
          return query;
        }
        return query.replace(/{([a-zA-Z0-9]+)?}/g, (text, key) => {
          if (values.hasOwnProperty(key)) {
            const item = values[key];
            if (Array.isArray(item)) {
              // concat the values with comma separate
              return item.map((v) => this._pool.escape(v)).join(',');
            }
            // 'NULL' is sql NULL :-)
            if (item === NULL_VALUE) {
              return NULL_VALUE;
            }
            return this._pool.escape(values[key]);
          }
          return text;
        });
      }
    });
  }

  /**
   * Get an database connection. No connection is open yet, it is only created the first time you use it.
   *
   * @returns {DbConnection}
   */
  getConnection(): DbConnection {
    return new DbConnection(this._pool);
  }

  private async shutdown(): Promise<void> {
    return new Promise(((resolve, reject) => {
      if (this._pool) {
        console.info('> Info: close database pool...');
        this._pool.end((err: MysqlError) => {
          if (err) {
            console.error('> Error: Query Error: %s -> %s', err.code, err.message);
            console.error('> Error: Stack: \n%s', err.stack);
            return reject(err);
          }
          resolve();
        })
      }
    }))
  }

  async onApplicationShutdown(signal?: string): Promise<any> {
    await this.shutdown();
  }
}
