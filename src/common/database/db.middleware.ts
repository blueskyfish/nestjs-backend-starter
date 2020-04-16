import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DbService, DbUtil } from './index';

@Injectable()
export class DbMiddleware implements NestMiddleware {

  constructor(private dbService: DbService) {}

  use(req: Request, res: Response, next: NextFunction): void {

    // add the connection to the request object with the property 'dbConn'
    DbUtil.setConnection(req, this.dbService.getConnection());

    next();
  }
}
