import { IDatabaseConnection } from './database.connection';

/**
 * The database service
 */
export interface IDatabaseService {

  getConnection(): IDatabaseConnection;

  release(): Promise<void>;
}
