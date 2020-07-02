import { IDatabaseConnection } from '../../common/database/kind';
import { IRepository } from './repository';
import { UserRepository } from './user';

/**
 * The repository pool
 */
export class RepositoryPool implements IRepository {

  private _userRepository: UserRepository = null;

  constructor(private _conn: IDatabaseConnection) {
  }

  get conn(): IDatabaseConnection {
    return this._conn;
  }

  /**
   * The sub repository works with the user entities
   *
   * @returns {UserRepository}
   */
  get user(): UserRepository {
    return !this._userRepository ?
      (this._userRepository = new UserRepository(this.conn)) : this._userRepository;
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
    this._conn = null;
    if (this._userRepository) {
      this._userRepository.close();
      this._userRepository = null;
    }
  }
}
