
import * as _ from 'lodash';

/**
 * An utility class for string
 */
export class StringUtil {

  static compare(a: string, b: string): number {
    if (_.isNil(a) && _.isNil(b)) {
      return 0;
    } else if (_.isNil(a) && !_.isNil(b)) {
      return -1;
    } else {
      return a.localeCompare(b);
    }
  }
}
