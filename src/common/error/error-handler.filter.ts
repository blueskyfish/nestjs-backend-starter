import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { getStageMode, StageMode } from '../../app.config';
import { CommonError, ErrorBody } from './index';

/**
 * The error context in the logger message
 */
const ERROR_CONTEXT = 'error';

/**
 * The filter process the {@link CommonError} and build the response.
 */
@Catch(CommonError)
export class ErrorHandlerFilter implements ExceptionFilter {

  /**
   * Create the instance of filter
   *
   * @param {Logger} logger the logger
   */
  constructor(private logger: Logger) {
  }

  catch(exception: CommonError, host: ArgumentsHost): any {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode: number = exception.statusCode;

    const method = request.method;
    const url = request.originalUrl;

    const data = exception.data ? { ...exception.data } : null;

    const stack = exception.stack ? exception.stack.split('\n') : [];

    const body: ErrorBody = {
      method,
      url,
      group: exception.group,
      code: exception.code,
      message: exception.message,
      stack: getStageMode() === StageMode.Dev ? stack : null,
      data,
    };

    // show the error
    this.logger.warn(`${method}: ${url} => [${body.group}.${body.code}] ${body.message}`, ERROR_CONTEXT);
    this.logger.debug(`\n${JSON.stringify(body, null, 2)}`, ERROR_CONTEXT);

    response
      .status(statusCode)
      .send(body);
  }

}
