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
  static getValue<T>(defValue: T, value?: T, min?: number): T {
    const isNumber = typeof defValue === 'number';
    const isString = typeof defValue === 'string';

    if (_.isNil(value) || (isNumber && isNaN(value as any))) {
      return defValue;
    }
    if (!_.isNil(min) && isNumber && ((value as any) < min)) {
      return min as any;
    }
    return value;
  }
}
