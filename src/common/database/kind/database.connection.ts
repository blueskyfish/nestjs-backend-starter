/**
 * The interface of the database connection
 */
export interface IDatabaseConnection {

  startTransaction(): Promise<void>;

  commit(): Promise<boolean>;

  rollback(): Promise<boolean>;

  select<T>(selectSql: string, values?: any): Promise<T[]>;

  selectOne<T>(selectSql: string, values?: any): Promise<T>;

  insert(insertSql: string, values?: any): Promise<number>;

  update(updateSql: string, values?: any): Promise<number>;

  delete(deleteSql: string, values?: any): Promise<number>;

  release(): void;

}
