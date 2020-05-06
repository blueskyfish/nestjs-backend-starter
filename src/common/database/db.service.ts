import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Moment } from 'moment';
import { createPool, MysqlError, Pool, PoolConnection } from 'mysql';
import { DateUtil, forEachIterator } from '../util';
import { DbConfig, NULL_VALUE } from './db.config';
import { DbConnection } from './db.connection';
import { DbUtil } from './db.util';

/**
 * Manages the database connection pool
 */
@Injectable()
export class DbService implements OnApplicationShutdown {

  /**
   * A map with the error codes and the counts of occasion
   *
   * @type {Map<string, number>}
   */
  private readonly errorCounter: Map<string, number> = new Map<string, number>();

  /**
   * The duration map for the connection.
   *
   * @type {Map<number, Moment>}
   */
  private readonly durationMap: Map<number, Moment> = new Map<number, Moment>();

  private readonly _pool: Pool;

  constructor(private config: DbConfig) {
    // create the pool
    this._pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: DbUtil.getValue(20000, null), // TODO Add "connectTimeout" to Configuration
      connectionLimit: config.connectLimit,
      acquireTimeout: DbUtil.getValue(20000,), // TODO Add "acquireTimeout" to Configuration
      waitForConnections: DbUtil.getValue(true, null), // TODO Add "waitForConnections" to Configuration
      // If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
      queueLimit: DbUtil.getValue(0, 0, 0), // Add "queueLimit" to Configuration

      // escapes the query parameters
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

    // register pool events
    this._pool.on('acquire', (conn: PoolConnection) => {
      // console.info('> Info: Acquire connection [%s]', conn.threadId);
      if (conn.threadId) {
        this.durationMap.set(conn.threadId, DateUtil.now());
      }

    });

    this._pool.on('enqueue', (err: MysqlError) => this.handleEnqueueError(err));

    this._pool.on('connection', (conn: PoolConnection) => {
      console.info('> Info: get connection [%s]', conn.threadId);
    });

    this._pool.on('release', (conn: PoolConnection) => {
      if (conn.threadId) {
        const startTime = this.durationMap.get(conn.threadId);
        if (!startTime) {
          console.warn('> Warn: The connection [%s] has no start time', conn.threadId);
          return;
        }

        const endTime = DateUtil.now();

        const milliSeconds = endTime.diff(startTime, 'milliseconds');
        console.info('> Info: connection [%s] is monitored with %s milliseconds', conn.threadId, milliSeconds);

        this.durationMap.delete(conn.threadId);
      } else {
        console.warn('> Warn: Connection could not be monitored');
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

        console.info('> Info: start to close database pool...');

        // show error counters
        forEachIterator(this.errorCounter.entries(), ([ code, count ]) => {
          console.info('> Info:  %s => %s', count, code);
        });
        this.errorCounter.clear();

        if (this.durationMap.size > 0) {

          forEachIterator(this.durationMap.entries(), ([ threadId, startTime ]) => {
            console.info('> Duration [%s] => %s', threadId, DateUtil.formatTimestamp(startTime));
          });

          this.durationMap.clear();
        }

        this._pool.end((err: MysqlError) => {
          if (err) {
            console.error('> Error: Query Error: %s -> %s', err.code, err.message);
            console.error('> Error: Stack: \n%s', err.stack);
            return reject(err);
          }

          console.info('> Info: finish of close database pool...');
          resolve();
        });
      }
    }));
  }

  async onApplicationShutdown(signal?: string): Promise<any> {
    await this.shutdown();
  }

  private handleEnqueueError(err: MysqlError): void {
    const code = DbUtil.adjustAndLower(err.code, '.');
    const message = err.sqlMessage;
    const sql = err.sql;
    console.error('> Error: %s => %s\n%s\n-----', code, message, sql);

    const count = this.errorCounter.get(code) || 0;
    this.errorCounter.set(code, count + 1);
  }
}
