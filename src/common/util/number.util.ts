
import * as _ from 'lodash';

/**
 * An utility class for numbers.
 */
export class NumberUtil {

  /**
   * Converts the string into a number.
   *
   * @param {string | number} s the value
   * @returns {number} in case of failed it returns `NaN`.
   */
  static toInt(s: string|number): number {

    if (_.isNil(s)) {
      return NaN;
    }

    if (typeof s === 'string') {
      try {
        const n: number = parseInt(s, 10);
        if (`${n}` === s) {
          return n;
        }
        // The value contains alphanumeric signs
        return NaN;
      } catch (e) {
        return NaN;
      }
    }
    return s as number;
  }

  static toFixed(s: number | string, digit = 2): string {
    if (typeof s === 'string') {
      s = NumberUtil.toInt(s);
    }
    if (isNaN(s)) {
      return null;
    }
    return s.toFixed(digit);
  }

  static adjustInt(value: number, min: number, max: number): number {
    if (isNaN(value) || value < min) {
      value = min;
    }
    if (value > max) {
      value = max;
    }
    return value;
  }
}
