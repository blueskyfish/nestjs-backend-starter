import { IDatabaseConnection } from './database.connection';

/**
 * The database service interface
 *
 * @see {@link DbService} the facade for the access to the database
 * @see {@link MysqlService} the implementation of the MySql database
 * @see {@link SqliteService} the implementation of the Sqlite database.
 */
export interface IDatabaseService {

  /**
   * Get an database connection.
   *
   * @returns {IDatabaseConnection}
   */
  getConnection(): IDatabaseConnection;

  /**
   * Shutdown the database.
   *
   * @return {Promise<void>}
   */
  release(): Promise<void>;
}
