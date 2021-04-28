/**
 * An utility class for string
 */
import { isNil } from './lodash';

export class StringUtil {

  static compare(a: string, b: string): number {
    if (isNil(a) && isNil(b)) {
      return 0;
    } else if (isNil(a) && !isNil(b)) {
      return -1;
    } else {
      return a.localeCompare(b);
    }
  }
}
