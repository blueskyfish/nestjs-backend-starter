import { HttpStatus, Injectable } from '@nestjs/common';
import { DB_ERROR_GROUP, DbService } from '../common/database';
import { CommonError, RequiredError } from '../common/error';
import { RepositoryPool } from './pool';

@Injectable()
export class RepositoryService {

  constructor(private dbService: DbService) {
  }

  /**
   * execute the business callback function.
   * @param {(rep: any) => Promise<T>} businessFunc The business function with the repository pool.
   * @returns {Promise<T>}
   */
  async execute<T>(businessFunc: (rep: any) => Promise<T>): Promise<T> {
    const conn = this.dbService.getConnection();
    const rep = new RepositoryPool(conn);
    try {
      return await businessFunc(rep);
    } catch (e) {
      this.handleError(e);
    } finally {
      // close the repository
      rep.close();
      // release the connection
      conn.release();
    }
  }

  private handleError(e): void {

    if (e instanceof TypeError) {
      throw new CommonError(HttpStatus.BAD_REQUEST, 'server', 'code', 'Error from javascript', {
        error: e,
      });
    }

    if (e instanceof RequiredError) {
      throw new CommonError(HttpStatus.BAD_REQUEST, 'server', 'parameter', 'Missing parameter value', {
        param: e.param,
      });
    }

    if (e instanceof CommonError) {

      if (e.group === DB_ERROR_GROUP) {
        throw new CommonError(HttpStatus.BAD_REQUEST, 'server', 'database', 'Internal error from the database', { ...e.data });
      }

      // fall throws
      throw e;
    }


  }
}
