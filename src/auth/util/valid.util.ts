import * as _ from 'lodash';
import { NumberUtil } from '../../common/util';

export class ValidUtil {

  static notNum(s: any): boolean {
    return _.isNil(s) || isNaN(s) || (s * 1 !== s);
  }

  static isPositiv(s: any): boolean {
    return !ValidUtil.notNum(s) && NumberUtil.toInt(s) > 0;
  }

  /**
   * Check whether the string is not null, not undefined and not empty
   *
   * @param {string} s the string
   * @returns {boolean} `true` means the string has content.
   */
  static notEmpty(s: string): boolean {
    return !_.isNil(s) && s !== '';
  }

}
