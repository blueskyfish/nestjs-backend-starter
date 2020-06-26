import { DbConnection } from '../../common/database';

export interface IRepository {

  readonly conn: DbConnection;

  close(): void;
}
