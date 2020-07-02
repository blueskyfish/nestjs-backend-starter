import * as _ from 'lodash';

/**
 * These are the prefix of the error codes that are removed
 */
const ERROR_PREFIX = [
  'EE_',
  'HA_ERR_',
  'ER_',
]

export class MysqlUtil {

  /**
   * Adjust the codes from the mysql errors to the error exception
   *
   * @param {string} errorCode the error constants
   * @param {string} sign the separator sign
   * @returns {string} the adjusted error code for the {@link DbError}
   */
  static adjustAndLower(errorCode: string, sign = '-'): string {
    if (_.isNil(errorCode)) {
      return '';
    }

    ERROR_PREFIX.forEach(prefix => {
      if (_.startsWith(errorCode, prefix)) {
        errorCode = errorCode.substring(prefix.length);
      }
    });

    return errorCode.toLowerCase()
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

    if (_.isNil(value) || (isNumber && isNaN(value as any))) {
      return defValue;
    }
    if (!_.isNil(min) && isNumber && ((value as any) < min)) {
      return min as any;
    }
    return value;
  }

}
