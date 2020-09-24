import { Logger } from '@nestjs/common';
import { EnvName } from '../../app.config';
import { fromEnv } from '../env';
import { LoUtil } from '../util';
import { Stage } from './stage.models';

export function asStage(value: string): Stage {
  switch (LoUtil.toLower(value || '')) {
    case 'develop':
      return Stage.Develop;
    case 'test':
      return Stage.Test;
    case 'int':
      return Stage.Int;
    case 'prod':
      return Stage.Prod;
    default:
      return null;
  }
}

export function getStageFromEnv(logger?: Logger): Stage {
  let stage = null;

  const nodeEnv = fromEnv(EnvName.NodeEnv);
  if (nodeEnv.hasValue) {
    // the "NODE_ENV" is existing and now it will be evaluated
    stage = LoUtil.toLower(nodeEnv.asString) === 'production' || LoUtil.toUpper(nodeEnv.asString) === 'PROD' ?
      Stage.Prod : null;
  }

  if (LoUtil.isNil(stage)) {
    const value = fromEnv(EnvName.Stage);
    stage = value.hasValue ? asStage(value.asString) : null;
  }

  if (LoUtil.isNil(stage)) {
    (logger && logger.warn('Stage: missing stage information! set stage to "develop"', 'Stage'));
    stage = Stage.Develop;
  } else {
    (logger && logger.log(`Stage: Found stage "${stage}"`, 'Stage'));
  }
  return stage || Stage.Develop;
}
