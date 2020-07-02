import { IDatabaseConnection } from '../kind';
import { SqliteService } from './sqlite.service';

export class SqliteConnection implements IDatabaseConnection {

  constructor(public readonly id, private sqlite: SqliteService) {
  }

  async startTransaction(): Promise<void> {
    await this.sqlite.startTransaction();
  }

  async commit(): Promise<boolean> {
    return await this.sqlite.commit();
  }

  async rollback(): Promise<boolean> {
    return this.sqlite.rollback();
  }

  async select<T>(selectSql: string, values: any = {}): Promise<T[]> {
    return this.sqlite.select<T>(selectSql, values);
  }

  async selectOne<T>(selectSql: string, values: any = {}): Promise<T> {
    return await this.sqlite.selectOne<T>(selectSql, values);
  }

  async insert(insertSql: string, values: any = {}): Promise<number> {
    return await this.sqlite.insert(insertSql, values);
  }

  async update(updateSql: string, values: any = {}): Promise<number> {
    return await this.sqlite.update(updateSql, values);
  }

  async delete(deleteSql: string, values: any = {}): Promise<number> {
    return await this.sqlite.delete(deleteSql, values);
  }

  /**
   * Send a sql query to the database an return the result.
   * It is for execute sql command like `truncate` or `show tables`...
   *
   * @param {string} sql the sql statement
   * @returns {Promise<any>} the result of the successful execution
   */
  async query(sql: string): Promise<any> {
    return await this.sqlite.query(sql);
  }

  release(): void {
    this.sqlite.releaseConnection(this);
    this.sqlite = null;
  }
}
