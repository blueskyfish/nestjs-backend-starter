import { DbConnection } from './db.connection';

export class DbConnectionMock extends DbConnection {

  private id = 0;
  private _commitFailed = false;
  private _rollbackFailed = false;

  private selectList: any[] = null;

  selectValues: any = null;
  insertValues: any = null;
  updateValues: any = null;
  deleteValues: any = null;

  isTransaction = false;

  constructor() {
    super(null);
  }

  mockCommitFailed(): void {
    this._commitFailed = true;
  }

  mockRollbackFailed(): void {
    this._rollbackFailed = true;
  }

  mockSelectList(list: any[]): void {
    this.selectList = list;
  }

  mockResult(): void {
    this._commitFailed = false;
    this._rollbackFailed = false;
    this.isTransaction = false;
    this.selectValues = null;
    this.selectList = null;
    this.insertValues = null;
    this.updateValues = null;
    this.deleteValues = null;
  }

  async select<T>(selectSql: string, values: any = {}): Promise<T[]> {
    this.selectValues = values;
    return this.selectList;
  }

  async insert(insertSql: string, values: any): Promise<number> {
    this.insertValues = values;
    return ++this.id;
  }

  async update(updateSql: string, values: any): Promise<number> {
    this.updateValues = values;
    return 1;
  }

  async delete(deleteSql: string, values: any): Promise<number> {
    this.deleteValues = values;
    return 1;
  }



  async startTransaction(): Promise<void> {
    this.isTransaction = true;
  }

  async commit(): Promise<boolean> {
    this.isTransaction = false;
    const shouldFailed = this._commitFailed;
    this._commitFailed = false;
    return !shouldFailed;
  }

  async rollback(): Promise<boolean> {
    this.isTransaction = false;
    const shouldFailed = this._rollbackFailed;
    this._rollbackFailed = false;
    return !shouldFailed;
  }

  release(): void {}
}
