import { OnApplicationShutdown } from '@nestjs/common';
import { Database } from 'sqlite3';
import { LogService } from '../../log';
import { forEachIterator, isNil } from '../../util';
import { IDatabaseService } from '../kind';
import { SQLITE_GROUP, SqliteConfig } from './sqlite.config';
import { SqliteConnection } from './sqlite.connection';
import { SqliteEscape } from './sqlite.escape';
import { SqliteUtil } from './sqlite.util';

export class SqliteService implements OnApplicationShutdown, IDatabaseService {

  private nextId = 0;

  private readonly connectMap: Map<number, SqliteConnection> = new Map<number, SqliteConnection>();

  private db: Database = null;

  constructor(private log: LogService, private config: SqliteConfig) {
  }

  getConnection(): SqliteConnection {
    const conn = new SqliteConnection(++this.nextId, this);
    this.connectMap.set(conn.id, conn);
    return conn;
  }

  releaseConnection(conn: SqliteConnection): void {
    if (isNil(conn) || !this.connectMap.has(conn.id)) {
      this.log.warn(SQLITE_GROUP, 'Missing connection id');
    }

    this.connectMap.delete(conn.id);
  }

  async release(): Promise<void> {
    if (!isNil(this.db)) {

      forEachIterator(this.connectMap.values(), (conn) => {
        conn.release();
      });

      await SqliteUtil.closeDatabase(this.db);
    }
  }

  /**
   * Execute a select sql statement and return a list of entities.
   *
   * @param {string} selectSql the select sql statement
   * @param values the *optional* query parameters
   * @return {Promise<T[]>} the list of entities
   */
  async select<T>(selectSql: string, values: any = {}): Promise<T[]> {
    const sql = this.escapeQuery(selectSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.select<T>(db, sql);
  }

  /**
   * Execute a select sql statement and return the first entity
   *
   * @param {string} selectSql the select sql statement
   * @param values the *optional* query parameters
   * @return {Promise<T>} the first entity or null
   */
  async selectOne<T>(selectSql: string, values: any = {}): Promise<T> {
    const sql = this.escapeQuery(selectSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.selectOne<T>(db, sql);
  }

  /**
   * Execute the update sql statement and returns the affected rows.
   *
   * @param {string} updateSql the update sql statement
   * @param values the *optional* query parameters
   * @return {Promise<number>} the affected rows
   */
  async update(updateSql: string, values: any = {}): Promise<number> {
    const sql = this.escapeQuery(updateSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.update(db, sql);
  }

  /**
   * Execute the insert sql statement and returns the inserted id.
   *
   * @param {string} insertSql the insert sql statement
   * @param values the *optional* query parameters
   * @return {Promise<number>} the inserted id of the new entity.
   */
  async insert(insertSql: string, values: any = {}): Promise<number> {
    const sql = this.escapeQuery(insertSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.insert(db, sql);
  }

  /**
   * Execute a delete sql statement and returns the affected rows.
   *
   * @param {string} deleteSql the delete sql statement.
   * @param values the *optional* query parameters
   * @return {Promise<number>} the affected rows.
   */
  async delete(deleteSql: string, values: any = {}): Promise<number> {
    const sql = this.escapeQuery(deleteSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.delete(db, sql);
  }

  /**
   * Execute a sql statement. It is use internal.
   *
   * @param {string} sql the sql statement.
   * @return {Promise<void>}
   */
  async query(sql: string): Promise<void> {
    const db = await this.openDatabase();
    return SqliteUtil.query(db, sql);
  }

  /**
   * start and open a transaction.
   *
   * @return {Promise<void>}
   */
  async startTransaction(): Promise<void> {
    await this.query('BEGIN TRANSACTION;');
  }

  /**
   * Commit an open transaction.
   *
   * @return {Promise<boolean>} `true` means the commit is successful
   */
  async commit(): Promise<boolean> {
    try {
      await this.query('COMMIT;');
      return true;
    } catch (e) {
      this.log.warn(SQLITE_GROUP, `Commit (${e.message})`);
      return false;
    }
  }

  /**
   * Rollback the open transactions.
   *
   * @return {Promise<boolean>} `true` means the rollback is successful
   */
  async rollback(): Promise<boolean> {
    try {
      await this.query('ROLLBACK');
    } catch (e) {
      this.log.warn(SQLITE_GROUP, `Rollback (${e.message})`);
      return false;
    }
  }

  /**
   * Escapes the values and insert into the query statement.
   *
   * @param {string} query the sql statement
   * @param values the value object
   * @return {string}
   */
  escapeQuery(query: string, values: any): string {
    return SqliteEscape.escapeQuery(query, values);
  }

  private async openDatabase(): Promise<Database> {
    if (isNil(this.db)) {
      this.db = await SqliteUtil.openDatabase(this.config);
      this.db.on('profile', (sql, time) => {
        this.log.debug(SQLITE_GROUP, `Profile sql (${time} ms):\n${sql}`)
      });
    }
    return this.db;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(signal?: string): Promise<any> {
    await this.release();
  }
}
