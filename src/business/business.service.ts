import { HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../common/database';
import { CommonError } from '../common/error';
import { RepositoryProvider } from './repository';

/**
 * The service is open the repository with the database-specific business cases
 */
@Injectable()
export class BusinessService {

  constructor(private dbService: DbService) {
  }

  /**
   * Open a repository and executes the callback function with the repository
   *
   * @param {(rep: RepositoryProvider) => Promise<T>} processFunc the process function
   * @param {CommonError} commonError the optional error
   * @returns {Promise<T>}
   */
  async openRepository<T>(processFunc: (rep: RepositoryProvider) => Promise<T>, commonError?: CommonError): Promise<T> {
    const conn = this.dbService.getConnection();
    const rep = new RepositoryProvider(conn);
    try {
      return await processFunc(rep);
    } catch (e) {
      if (e instanceof CommonError) {
        // error is an instance of CommonError
        throw e;
      }
      if (commonError) {
        // a user defined common error
        throw commonError;
      }

      // nothing from all: throws an **Bad Request**
      throw new CommonError(HttpStatus.BAD_REQUEST, 'business', 'process', 'process error', {
        message: e.message
      });
    } finally {
      // close the repository
      rep.close();
      // release the connection
      conn.release();
    }
  }

}
