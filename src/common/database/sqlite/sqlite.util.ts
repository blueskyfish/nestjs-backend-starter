import * as _ from 'lodash';
import { Database } from 'sqlite3';
import { SqliteError } from '../db.error';
import { ISqliteConfig } from './sqlite.config';

/**
 * Utility class
 */
export class SqliteUtil {

  /**
   * Open the sqlite database
   *
   * @param {ISqliteConfig} config the configuration
   * @return {Promise<Database>} the database in the resolve callback
   */
  static async openDatabase(config: ISqliteConfig): Promise<Database> {
    return new Promise<Database>((resolve, reject) => {
      const db = new Database(config.filename, config.mode, err => {
        if (err) {
          return reject(SqliteUtil.toError(err, 'database.open'));
        }
        resolve(db);
      });
    });
  }

  /**
   * Close the database
   * @param {Database} db the sqlite database
   * @return {Promise<boolean>}
   */
  static async closeDatabase(db: Database): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!_.isNil(db)) {
        resolve(false);
      }
      db.close((err) => {
        if (err) {
          return reject(SqliteUtil.toError(err, 'database.close'));
        }
        resolve(true);
      });
    });
  }

  /**
   * Helper function executes the select sql statement and returns the list of entities
   *
   * @param {Database} db the sqlite database
   * @param {string} selectSql the select sql statement
   * @return {Promise<T[]>} the list of entities
   */
  static async select<T>(db: Database, selectSql: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      db.all(selectSql, (err, rows: T[]) => {
        if (err) {
          return reject(SqliteUtil.toError(err, 'select'));
        }
        resolve(rows);
      });
    });
  }

  /**
   * Helper function get the first element of the select sql statement.
   *
   * @param {Database} db the sqlite database
   * @param {string} selectSql the select sql statement
   * @return {Promise<T>} the first element
   */
  static async selectOne<T>(db: Database, selectSql: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      db.get(selectSql, (err, row: T) => {
        if (err) {
          return reject(SqliteUtil.toError(err, 'selectOne'));
        }
        resolve(row);
      });
    });
  }

  /**
   * Helper function for execute an update sql statement.
   *
   * @param {Database} db the sqlite database
   * @param {string} sql the update sql statement
   * @return {Promise<number>} the affected rows
   */
  static async update(db: Database, sql: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run(sql, function(err) {
        if (err) {
          return reject(SqliteUtil.toError(err, 'update'));
        }
        resolve(this.changes);
      });
    });
  }

  /**
   * Helper function execute a delete sql statement.
   *
   * @param {Database} db the sqlite database
   * @param {string} sql the delete sql statement
   * @return {Promise<number>} the affected rows
   */
  static async delete(db: Database, sql: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run(sql, function(err) {
        if (err) {
          return reject(SqliteUtil.toError(err, 'delete'));
        }
        resolve(this.changes);
      });
    })
  }

  /**
   * Helper function execute the insert sql statement.
   *
   * @param {Database} db the sqlite database
   * @param {string} sql the insert sql statement
   * @return {Promise<number>} the inserted id of the record
   */
  static async insert(db: Database, sql: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run(sql, function(err) {
        if (err) {
          return reject(SqliteUtil.toError(err, 'insert'));
        }
        resolve(this.lastID);
      });
    });
  }

  static async query(db: Database, sql): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.exec(sql, function(err) {
        if (err) {
          return reject(SqliteUtil.toError(err, 'query'));
        }
        resolve();
      });
    });
  }

  private static toError(err: Error, groupCode: string): SqliteError {
    const errno = _.get(err, 'errno', 0);
    const code = _.get(err, 'code', '');
    const message = _.get(err, 'message');
    return new SqliteError(groupCode, message, {
      errno,
      code,
    });
  }
}
