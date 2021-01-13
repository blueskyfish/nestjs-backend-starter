import { isNil, toInt } from '../../common/util';

export class ValidUtil {

  static notNum(s: any): boolean {
    return isNil(s) || isNaN(s) || (s * 1 !== s);
  }

  static isPositiv(s: any): boolean {
    return !ValidUtil.notNum(s) && toInt(s) > 0;
  }

  /**
   * Check whether the string is not null, not undefined and not empty
   *
   * @param {string} s the string
   * @returns {boolean} `true` means the string has content.
   */
  static notEmpty(s: string): boolean {
    return !isNil(s) && s !== '';
  }

}
