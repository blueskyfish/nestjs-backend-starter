import { DbConnection } from '../../common/database';
import { DeviceRepository } from './device';
import { IRepository } from './repository';
import { UserRepository } from './user';

export class RepositoryProvider implements IRepository {

  private _deviceRepository: DeviceRepository = null;
  private _userRepository: UserRepository = null;

  get conn(): DbConnection {
    return this._conn;
  }

  get device(): DeviceRepository {
    return !this._deviceRepository ?
      (this._deviceRepository = new DeviceRepository(this.conn)) : this._deviceRepository;
  }

  get user(): UserRepository {
    return !this._userRepository ?
      (this._userRepository = new UserRepository(this.conn)) : this._userRepository;
  }

  constructor(private _conn: DbConnection) {
  }

  /**
   * @see {@link DbConnection.startTransaction}
   */
  async startTransaction(): Promise<void> {
    await this.conn.startTransaction();
  }

  /**
   * @see {@link DbConnection.commit}
   */
  async commit(): Promise<boolean> {
    return await this.conn.commit();
  }

  /**
   * @see {@link DbConnection.rollback}
   */
  async rollback(): Promise<boolean> {
    return await this.conn.rollback();
  }

  close(): void {

    doClose(this._deviceRepository);
    doClose(this._userRepository);

    this._deviceRepository = null;
    this._userRepository = null;

    this._conn = null;
  }
}

const doClose = (rep: IRepository): void => {
  if (rep) {
    rep.close();
  }
}
