import { Request } from 'express';
import { DbConnection } from './db.connection';

export class DbUtil {

  static adjustAndLower(s: string, sign: string = '-'): string {
    if (!s) {
      return '';
    }
    return s.toLowerCase()
      .replace(/[ \t\r\n_(){}#\[\]<>!?&%$]/g, '-')
      .replace(/--/g, '-')
      .replace(/-\./g, '.')
      .replace(/-/g, sign);
  }

  static getConnection(req: Request): DbConnection {
    return (req as any).dbConn || null;
  }

  static setConnection(req: Request, conn: DbConnection): void {
    (req as any).dbConn = conn;
  }
}
