import { IDatabaseConnection } from '../../common/database/kind';
import { IRepository } from './repository';

export class SubRepository implements IRepository {

  constructor(private _conn: IDatabaseConnection) {
  }

  get conn(): IDatabaseConnection {
    return this._conn;
  }

  close() {
    this._conn = null;
  }
}
