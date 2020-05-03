import { HttpStatus } from '@nestjs/common';
import { DbConnection } from '../../common/database';
import { CommonError } from '../../common/error';
import { RepositoryProvider } from './repository.provider';

/**
 * The callback function for execute a business process and returns the result from type `T`
 */
export type BusinessFunc<T, R extends RepositoryProvider> = (rep: R) => Promise<T>

/**
 * The interface for the execution of the business process
 */
export interface IRepositoryExecute<T, R extends RepositoryProvider> {

  /**
   * Executes the business process.
   * @param {BusinessFunc<*, *>} businessFunc the callback function with the business logic
   * @returns {Promise<*>} the result of the business process
   */
  execute(businessFunc: BusinessFunc<T, R>): Promise<T>;
}

export const openRepository = <T>(conn: DbConnection): IRepositoryExecute<T, RepositoryProvider> => {
  const rep = new RepositoryProvider(conn);
  return {

    async execute( businessFunc: BusinessFunc<T, RepositoryProvider>): Promise<T> {
      try {
        return await businessFunc(rep);
      } catch (e) {

        if (e instanceof CommonError) {
          // a common error is thrown again.
          throw e;
        }

        // bad request => unspecified error has occurred
        throw new CommonError(
          HttpStatus.BAD_REQUEST, 'business', 'failed', 'process the business logic is failed', {
            message: e.message || e,
          }
        );

      } finally {
        rep.close();
        conn = null;
      }
    }
  };
}
