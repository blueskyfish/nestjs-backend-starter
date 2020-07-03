import { Logger, OnApplicationShutdown } from '@nestjs/common';
import { Moment } from 'moment';
import { createPool, MysqlError, Pool, PoolConnection } from 'mysql';
import { DateUtil, forEachIterator } from '../../util';
import { NULL_VALUE } from '../db.config';
import { DB_ERROR_GROUP } from '../db.error';
import { IDatabaseService } from '../kind';
import { MysqlConfig } from './mysql.config';
import { MysqlConnection } from './mysql.connection';
import { MysqlUtil } from './mysql.util';

/**
 * Manages the database connection pool
 */
export class MysqlService implements OnApplicationShutdown, IDatabaseService {

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

  constructor(private logger: Logger, private config: MysqlConfig) {
    // create the pool
    this._pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: config.connectTimeout,
      connectionLimit: config.connectLimit,
      acquireTimeout: config.acquireTimeout,
      waitForConnections: config.waitForConnections,
      // If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
      queueLimit: config.queueLimit,

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
      this.logger.debug(`Acquire connection [${conn.threadId}]`, DB_ERROR_GROUP);
      if (conn.threadId) {
        this.durationMap.set(conn.threadId, DateUtil.now());
      }

    });

    this._pool.on('enqueue', (err: MysqlError) => this.handleEnqueueError(err));

    this._pool.on('connection', (conn: PoolConnection) => {
      this.logger.debug(`connection [${conn.threadId}] requested`, DB_ERROR_GROUP);
    });

    this._pool.on('release', (conn: PoolConnection) => {
      if (conn.threadId) {
        const startTime = this.durationMap.get(conn.threadId);
        if (!startTime) {
          this.logger.warn(`> Warn: The connection [${conn.threadId}] has no start time`, DB_ERROR_GROUP);
          return;
        }

        const endTime = DateUtil.now();

        const milliSeconds = endTime.diff(startTime, 'milliseconds');
        this.logger.debug(`connection [${conn.threadId}] is monitored with ${milliSeconds} milliseconds`, DB_ERROR_GROUP);

        this.durationMap.delete(conn.threadId);
      } else {
        this.logger.warn('> Warn: Connection could not be monitored', DB_ERROR_GROUP);
      }
    });
  }

  /**
   * Get an database connection. No connection is open yet, it is only created the first time you use it.
   *
   * @returns {MysqlConnection}
   */
  getConnection(): MysqlConnection {
    return new MysqlConnection(this.logger, this._pool);
  }

  /**
   * Shutdown the database and close the pool
   *
   * @return {Promise<void>}
   */
  async release(): Promise<void> {
    await this.shutdown();
  }

  private async shutdown(): Promise<void> {
    return new Promise(((resolve, reject) => {
      if (this._pool) {

        this.logger.log('close database pool...', DB_ERROR_GROUP);

        // show error counters
        forEachIterator(this.errorCounter.entries(), ([ code, count ]) => {
          this.logger.log(`Error Counter:  ${count} => ${code}`, DB_ERROR_GROUP);
        });
        this.errorCounter.clear();

        if (this.durationMap.size > 0) {

          forEachIterator(this.durationMap.entries(), ([ threadId, startTime ]) => {
            this.logger.log(`Duration [${threadId}] => ${DateUtil.formatTimestamp(startTime)}`, DB_ERROR_GROUP);
          });

          this.durationMap.clear();
        }

        this._pool.end((err: MysqlError) => {
          if (err) {
            this.logger.warn(`> Error: Query Error: ${err.code} -> ${err.message}`, DB_ERROR_GROUP);
            this.logger.warn(`> Error: Stack: \n${err.stack}`, DB_ERROR_GROUP);
            return reject(err);
          }

          this.logger.log('finish of close database pool...', DB_ERROR_GROUP);
          resolve();
        });
      }
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(signal?: string): Promise<any> {
    await this.shutdown();
  }

  private handleEnqueueError(err: MysqlError): void {
    if (err) {
      const code = MysqlUtil.adjustAndLower(err.code, '.');
      const message = err.sqlMessage;
      const sql = err.sql;
      this.logger.warn(`Error: ${code} => ${message}\n${sql}\n-----`, DB_ERROR_GROUP);

      const count = this.errorCounter.get(code) || 0;
      this.errorCounter.set(code, count + 1);
    }
  }
}
