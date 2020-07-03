import { IDatabaseConnection, IDatabaseService } from './kind';

/**
 * This is the facade of the database service.
 *
 * @see {@link MysqlService}
 * @see {@link SqliteService}
 */
export class DbService implements IDatabaseService {

  /**
   * Create the facade instance
   * @param {IDatabaseService} db the real database service
   */
  constructor(private db: IDatabaseService) {
  }

  /**
   * @see {@link IDatabaseService.getConnection}
   */
  getConnection(): IDatabaseConnection {
    return this.db.getConnection();
  }

  /**
   * @see {@link IDatabaseService.release}
   */
  async release(): Promise<void> {
    await this.db.release();
  }
}
