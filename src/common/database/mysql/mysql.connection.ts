import { Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { Connection, MysqlError, Pool, PoolConnection } from 'mysql';
import { connectError, DB_ERROR_GROUP, queryError, transactionError } from '../db.error';
import { IDatabaseConnection } from '../kind';

// Kind of execution
export type ExecutionAction = 'select' | 'insert' | 'update' | 'delete' | 'query';

/**
 * The database connection executes sql statements and returns the entities.
 *
 * **There are different kind of execution:**
 *
 * * `select` or `selectOne` should execute an select statement (e.g. `SELECT * FROM ...`) and returns entities.
 * * `insert` should execute an insert statement (e.g. `INSERT INTO ...`) and it the return the new id of the entity
 * * `update` should execute an update statement (e.g. `UPDATE ...`) and it returns the changed rows.
 * * `delete` should execute a delete statement (e.g. `DELETE FROM ...`) and it returns the affected rows,
 * * `query` executes an raw sql statement und returns the result in case of success.
 *
 * **There are transaction handling**
 * * `startTransaction` is start a sql transaction
 * * `commit()` is commit an open transaction
 * * `rollback()` is rollback an open transaction.
 */
export class MysqlConnection implements IDatabaseConnection {
  private _connection: PoolConnection = null;

  constructor(private readonly logger: Logger, private _pool: Pool) {
  }

  /**
   * Starts the transaction, that must be closed with `commit` or `rollback`.
   *
   * @return {Promise<void>}
   */
  startTransaction(): Promise<void> {
    return this.openConnection()
      .then(() => {
        return new Promise<void>((resolve, reject) => {
          this._connection.beginTransaction((err: MysqlError) => {
            if (err) {
              this.logger.warn(`Begin Transaction Error: ${err.errno} -> ${err.message}`, DB_ERROR_GROUP);
              return reject(transactionError(err));
            }
            resolve();
          });
        });
      });
  }

  /**
   * Close the transaction and commit the changing.
   * @return {Promise<boolean>}
   */
  commit(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this._connection.commit((err: MysqlError) => {
        if (err) {
          this.logger.warn(`Commit Error: ${err.errno} -> ${err.message}`, DB_ERROR_GROUP);
          return resolve(false);
        }
        resolve(true);
      });
    });
  }

  /**
   * Cancel the transaction and rollback the changing.
   * @return {Promise<boolean>}
   */
  rollback(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this._connection.rollback((err: MysqlError) => {
        if (err) {
          this.logger.warn(`Rollback Error: ${err.errno} -> ${err.message}`, DB_ERROR_GROUP);
          return resolve(false);
        }
        resolve(true);
      });
    });
  }

  /**
   * Select an array of entities. If the result is not an array, then it returns an empty array.
   *
   * @param {string} selectSql the select sql statement
   * @param values the values of the select statement
   * @returns {Promise<T[]>} the list of entities.
   */
  async select<T>(selectSql: string, values: any = {}): Promise<T[]> {
    const result = await this.execute('select', selectSql, values);
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  }

  /**
   * Select the first entity. If the result is not an array or an empty array, then it returns `null`
   *
   * @param {string} selectSql the select sql statement
   * @param values the values of the select statement
   * @returns {Promise<T | null>}
   */
  async selectOne<T>(selectSql: string, values: any = {}): Promise<T | null> {
    const list = await this.select<T>(selectSql, values);
    if (_.size(list) > 0) {
      return list[0];
    }
    return null;
  }

  /**
   * Insert an entity and returns the new id of the entity.
   *
   * @param {string} insertSql the insert sql statement
   * @param values the entity
   * @returns {Promise<number>} `NaN` means: there is no insertId available
   */
  async insert(insertSql: string, values: any): Promise<number> {
    const result = await this.execute('insert', insertSql, values);
    return _.get(result, 'insertId', NaN);
  }

  /**
   * Update an existing entity. It returns the changed rows.
   *
   * @param {string} updateSql the update sql statement
   * @param values the changed entity
   * @returns {Promise<number>} `NaN` means: there is no changed rows.
   */
  async update(updateSql: string, values: any): Promise<number> {
    const result = await this.execute('update', updateSql, values);
    return _.get(result, 'changedRows', NaN);
  }

  /**
   * Delete an existing entity. It returns the affected rows.
   *
   * @param {string} deleteSql the delete sql statement
   * @param values the entity
   * @returns {Promise<number>} `NaN` means: there is no affected rows.
   */
  async delete(deleteSql: string, values: any): Promise<number> {
    const result = await this.execute('delete', deleteSql, values);
    return _.get(result, 'affectedRows', NaN);
  }

  /**
   * Send a sql query to the database an return the result.
   * It is for execute sql command like `truncate` or `show tables`...
   *
   * @param {string} sql the sql statement
   * @returns {Promise<any>} the result of the successful execution
   */
  async query(sql: string): Promise<any> {
    return await this.execute('query', sql);
  }

  private async execute(action: ExecutionAction, sql: string, values?: any): Promise<any> {

    const connection = await this.openConnection();

    return new Promise<any>(((resolve, reject) => {
      connection.query(sql, values, (err: MysqlError, result) => {
        if (err) {
          this.logger.warn(`Action (${action}) Error: ${err.errno} -> ${err.message}`, DB_ERROR_GROUP);
          this.logger.warn(`Sql:\n${err.sql}`, DB_ERROR_GROUP);
          this.logger.warn(`Stack: \n${err.stack}`, DB_ERROR_GROUP);
          return reject(queryError(err));
        }
        resolve(result);
      });
    }));
  }

  private async openConnection(): Promise<Connection> {
    if (this._connection) {
      return this._connection;
    }
    this._connection = await this.requestConnection();
    return this._connection;
  }

  private async requestConnection(): Promise<PoolConnection> {
    return new Promise<PoolConnection>(((resolve, reject) => {
      this._pool.getConnection(((err: MysqlError, connection: PoolConnection) => {
        if (err) {
          this.logger.error(`Conn Error: ${err.errno} -> ${err.message}`, DB_ERROR_GROUP);
          return reject(connectError(err));
        }
        resolve(connection);
      }));
    }));

  }

  /**
   * This should not call directly. It execute on response event `finish`.
   */
  async release(): Promise<void> {
    if (this._connection) {
      this._connection.release();
      this._connection = null;
    }
  }

}
