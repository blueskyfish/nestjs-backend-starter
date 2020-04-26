import * as _ from 'lodash';
import { SecondUtil } from '../../common/util';
import { TokenConfig } from './token.config';

/**
 * Create the token configuration
 *
 * @param {number} expires
 * @returns {TokenConfig}
 */
export function tokenConfigFactory(expires: number): TokenConfig {
  if (_.isNil(expires) || isNaN(expires) || expires <= 0) {
    expires = SecondUtil.fromMinutes(5);
  }
  return new TokenConfig(expires);
}
