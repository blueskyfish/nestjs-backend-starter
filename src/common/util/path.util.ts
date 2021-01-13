import * as os from 'os';
import * as path from 'path';
import { isNil } from './lo.util';

/**
 * The user home directory
 */
export const HomePath = os.homedir();

/**
 * The helper for path operations.
 */
export class PathUtil {

  /**
   * Adjust the pathname and replace the variable `{HOME}` and `{CWD}` with the reald value
   *
   * @param {string} pathname the path name
   * @returns {string} the adjusted path or null.
   */
  static adjust(pathname: string): string {
    if (isNil(pathname)) {
      return null;
    }
    return path.normalize(pathname
      .replace('{HOME}', HomePath)
      .replace('{CWD}', process.cwd())
    );
  }
}
