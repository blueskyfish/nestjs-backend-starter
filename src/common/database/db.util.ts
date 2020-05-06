import * as _ from 'lodash';

export class DbUtil {

  static adjustAndLower(s: string, sign: string = '-'): string {
    if (!s) {
      return '';
    }
    return s.toLowerCase()
      .replace(/[ \t\r\n_(){}#\[\]<>!?&%$]/g, '-')
      .replace(/--/g, '-')
      .replace(/-\./g, '.')
      .replace(/-/g, sign);
  }

  /**
   * Get the value
   *
   * @param {T} defValue the default value
   * @param {T} value the value
   * @param {T} min the min value
   * @returns {T} the value
   */
  static getValue<T>(defValue: T, value?: T, min?: T): T {
    if (_.isNil(value)) {
      return defValue;
    }
    if (!_.isNil(min) && value < min) {
      return min;
    }
    return value;
  }
}
