import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DbUtil } from '../database';

/**
 * Listen for the event **finish** in the express response. After this event, the whole request is finish
 * with the response. No more data sent to the client.
 */
export class RequestFinishMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction): any {

    res.on('finish', async () => {

      const conn = DbUtil.getConnection(req);
      if (conn) {
        // releases the connection
        conn.release();
      }
    });

    next();
  }
}
