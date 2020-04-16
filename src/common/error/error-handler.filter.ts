import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { CommonError, ErrorBody } from './index';

@Catch(CommonError)
export class ErrorHandlerFilter implements ExceptionFilter {

  catch(exception: CommonError, host: ArgumentsHost): any {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.statusCode;

    const method = request.method;
    const url = request.originalUrl;

    let data = exception.data ? { ...exception.data } : null;

    const stack = exception.stack ? exception.stack.split('\n') : [];

    const body: ErrorBody = {
      method,
      url,
      group: exception.group,
      code: exception.code,
      message: exception.message,
      stack,
      data,
    };

    // show the error into the console log
    console.error('> Error:\n%s\n', JSON.stringify(body, null, 2));

    response
      .status(statusCode)
      .send(body);
  }

}
