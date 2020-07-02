import { Database } from 'sqlite3';
import * as _ from 'lodash';
import { ISqliteConfig } from './sqlite.config';

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
          return reject(err);
        }
        resolve(db);
      });
    });
  }

  static async closeDatabase(db: Database): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!_.isNil(db)) {
        resolve(false);
      }
      db.close((err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  /**
   * Helper function executes the select sql statement and returns the list of entities
   *
   * @param {Database} db the database
   * @param {string} selectSql the select sql statement
   * @return {Promise<T[]>} the list of entities
   */
  static async select<T>(db: Database, selectSql: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      db.all(selectSql, (err, rows: T[]) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  /**
   * Helper function get the first element of the select sql statement.
   *
   * @param {Database} db the database
   * @param {string} selectSql the select sql statement
   * @return {Promise<T>} the first element
   */
  static async selectOne<T>(db: Database, selectSql: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      db.get(selectSql, (err, row: T) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  static async update(db: Database, sql: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run(sql, function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.changes);
      });
    });
  }

  static async delete(db: Database, sql: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run(sql, function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.changes);
      });
    })
  }

  static async insert(db: Database, sql: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      db.run(sql, function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  }

  static async query(db: Database, sql): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.exec(sql, function(err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
