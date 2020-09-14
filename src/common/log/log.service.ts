import { Injectable, Logger } from '@nestjs/common';
import { LogConfig, Stage } from './log.config';

const IS_DEBUG = [Stage.Test, Stage.Develop];
const IS_INFO = [Stage.Test, Stage.Develop, Stage.Int];
const IS_WARN = [Stage.Test, Stage.Develop, Stage.Int, Stage.Prod];

@Injectable()
export class LogService {

  constructor(private config: LogConfig, private logger: Logger) {
  }

  trace(context: string, message: string): void {
    if (this.config.stage === Stage.Test) {
      this.logger.verbose(message, context);
    }
  }

  debug(context: string, message: string): void {
    if (IS_DEBUG.includes(this.config.stage)) {
      this.logger.debug(message, context);
    }
  }

  info(context: string, message: string): void {
    if (IS_INFO.includes(this.config.stage)) {
      this.logger.log(message, context);
    }
  }

  warn(context: string, message: string): void {
    if (IS_WARN.includes(this.config.stage)) {
      this.logger.warn(message, context);
    }
  }


  error(context: string, message: string): void {
    if (IS_WARN.includes(this.config.stage)) {
      this.logger.error(message, context);
    }
  }
}
