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

  getConnection(): IDatabaseConnection {
    return this.db.getConnection();
  }

  async release(): Promise<void> {
    await this.db.release();
  }
}
