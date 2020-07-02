import { IDatabaseConnection } from '../../common/database/kind';

export interface IRepository {

  readonly conn: IDatabaseConnection;

  close(): void;
}
