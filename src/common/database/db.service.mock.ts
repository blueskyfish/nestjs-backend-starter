import { DbConnection } from './db.connection';
import { DbConnectionMock } from './db.connection.mock';
import { DbService } from './db.service';

export class DbServiceMock extends DbService {

  getConnection(): DbConnection {
    return new DbConnectionMock();
  }
}
