import { Injectable, Logger } from '@nestjs/common';
import { isNil } from '../util';
import { Stage } from './stage.models';
import { getStageFromEnv } from './stage.util';

/**
 * Manages the running stage.
 */
@Injectable()
export class StageService {

  private _stage: Stage = null;

  get stage(): Stage {
    this.checkStage();
    return this._stage;
  }

  constructor(private logger: Logger) {
  }

  private checkStage(): void {
    if (isNil(this._stage)) {
      this._stage = getStageFromEnv(this.logger);
    }
  }
}
