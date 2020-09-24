import { Injectable, Logger } from '@nestjs/common';
import { Stage } from '../stage';
import { StageService } from '../stage';

const IS_DEBUG = [Stage.Test, Stage.Develop];
const IS_INFO = [Stage.Test, Stage.Develop, Stage.Int];
const IS_WARN = [Stage.Test, Stage.Develop, Stage.Int, Stage.Prod];

@Injectable()
export class LogService {

  constructor(private stageService: StageService, private logger: Logger) {
  }

  trace(context: string, message: string): void {
    if (this.stageService.stage === Stage.Test) {
      this.logger.verbose(message, context);
    }
  }

  debug(context: string, message: string): void {
    if (IS_DEBUG.includes(this.stageService.stage)) {
      this.logger.debug(message, context);
    }
  }

  info(context: string, message: string): void {
    if (IS_INFO.includes(this.stageService.stage)) {
      this.logger.log(message, context);
    }
  }

  warn(context: string, message: string): void {
    if (IS_WARN.includes(this.stageService.stage)) {
      this.logger.warn(message, context);
    }
  }


  error(context: string, message: string): void {
    if (IS_WARN.includes(this.stageService.stage)) {
      this.logger.error(message, context);
    }
  }
}
