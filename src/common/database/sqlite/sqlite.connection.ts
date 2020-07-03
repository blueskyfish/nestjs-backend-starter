import { IDatabaseConnection } from '../kind';
import { SqliteService } from './sqlite.service';

/**
 * The sqlite connection is implemented the interface {@link IDatabaseConnection}.
 *
 * It delegates all method to the parent {@link SqliteService}.
 */
export class SqliteConnection implements IDatabaseConnection {

  /**
   * Create the connection instance.
   *
   * @param id the id of the connection.
   * @param {SqliteService} sqlite the sqlite service
   */
  constructor(public readonly id, private sqlite: SqliteService) {
  }

  /**
   * @see {@link SqliteService.startTransaction}
   */
  async startTransaction(): Promise<void> {
    await this.sqlite.startTransaction();
  }

  /**
   * @see {@link SqliteService.commit}
   */
  async commit(): Promise<boolean> {
    return await this.sqlite.commit();
  }

  /**
   * @see {@link SqliteService.rollback}
   */
  async rollback(): Promise<boolean> {
    return this.sqlite.rollback();
  }

  /**
   * @see {@link SqliteService.select}
   */
  async select<T>(selectSql: string, values: any = {}): Promise<T[]> {
    return this.sqlite.select<T>(selectSql, values);
  }

  /**
   * @see {@link SqliteService.selectOne}
   */
  async selectOne<T>(selectSql: string, values: any = {}): Promise<T> {
    return await this.sqlite.selectOne<T>(selectSql, values);
  }

  /**
   * @see {@link SqliteService.insert}
   */
  async insert(insertSql: string, values: any = {}): Promise<number> {
    return await this.sqlite.insert(insertSql, values);
  }

  /**
   * @see {@link SqliteService.update}
   */
  async update(updateSql: string, values: any = {}): Promise<number> {
    return await this.sqlite.update(updateSql, values);
  }

  /**
   * @see {@link SqliteService.delete}
   */
  async delete(deleteSql: string, values: any = {}): Promise<number> {
    return await this.sqlite.delete(deleteSql, values);
  }

  release(): void {
    this.sqlite.releaseConnection(this);
    this.sqlite = null;
  }
}
