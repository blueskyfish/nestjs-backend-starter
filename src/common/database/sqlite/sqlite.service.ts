import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import * as _ from 'lodash';
import { Database } from 'sqlite3';
import { forEachIterator } from '../../util';
import { IDatabaseService } from '../kind';
import { SQLITE_GROUP, SqliteConfig } from './sqlite.config';
import { SqliteConnection } from './sqlite.connection';
import { SqliteEscape } from './sqlite.escape';
import { SqliteUtil } from './sqlite.util';

@Injectable()
export class SqliteService implements OnApplicationShutdown, IDatabaseService {

  private nextId = 0;

  private readonly connectMap: Map<number, SqliteConnection> = new Map<number, SqliteConnection>();

  private db: Database = null;

  constructor(private logger: Logger, private config: SqliteConfig) {
  }

  getConnection(): SqliteConnection {
    const conn = new SqliteConnection(++this.nextId, this);
    this.connectMap.set(conn.id, conn);
    return conn;
  }

  releaseConnection(conn: SqliteConnection): void {
    if (_.isNil(conn) || !this.connectMap.has(conn.id)) {
      this.logger.warn('Missing connection id', SQLITE_GROUP);
    }

    this.connectMap.delete(conn.id);
  }

  async release(): Promise<void> {
    if (!_.isNil(this.db)) {

      forEachIterator(this.connectMap.values(), (conn) => {
        conn.release();
      });

      await SqliteUtil.closeDatabase(this.db);
    }
  }

  async select<T>(selectSql: string, values: any = {}): Promise<T[]> {
    const sql = this.escapeQuery(selectSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.select<T>(db, sql);
  }

  async selectOne<T>(selectSql: string, values: any = {}): Promise<T> {
    const sql = this.escapeQuery(selectSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.selectOne<T>(db, sql);
  }

  async update(updateSql: string, values: any = {}): Promise<number> {
    const sql = this.escapeQuery(updateSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.update(db, sql);
  }

  async insert(insertSql: string, values: any = {}): Promise<number> {
    const sql = this.escapeQuery(insertSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.insert(db, sql);
  }

  async delete(deleteSql: string, values: any = {}): Promise<number> {
    const sql = this.escapeQuery(deleteSql, values);
    const db = await this.openDatabase();
    return await SqliteUtil.delete(db, sql);
  }

  async query(sql: string): Promise<void> {
    const db = await this.openDatabase();
    return SqliteUtil.query(db, sql);
  }

  async startTransaction(): Promise<void> {
    await this.query('BEGIN TRANSACTION;');
  }

  async commit(): Promise<boolean> {
    try {
      await this.query('COMMIT;');
      return true;
    } catch (e) {
      this.logger.warn(`Commit (${e.message})`, SQLITE_GROUP);
      return false;
    }
  }

  async rollback(): Promise<boolean> {
    try {
      await this.query('ROLLBACK');
    } catch (e) {
      this.logger.warn(`Rollback (${e.message})`, SQLITE_GROUP);
      return false;
    }
  }

  escapeQuery(query: string, values: any): string {
    return SqliteEscape.escapeQuery(query, values);
  }

  private async openDatabase(): Promise<Database> {
    if (_.isNil(this.db)) {
      this.db = await SqliteUtil.openDatabase(this.config);
      this.db.on('profile', (sql, time) => {
        this.logger.debug(`Profile sql (${time}:\n${sql}`, SQLITE_GROUP)
      });
    }
    return this.db;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(signal?: string): Promise<any> {
    await this.release();
  }
}
