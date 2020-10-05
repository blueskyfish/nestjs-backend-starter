
/**
 * Small helper class for replace [lodash](https://lodash.com/)
 *
 * **Reason**
 *
 * * TreeShacking
 *
 * @see <https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore>
 */
export class LoUtil {

  static isNil(v: any): boolean {
    return v === null || typeof v === 'undefined';
  }

  static isString(v: any): boolean {
    return !LoUtil.isNil(v) && typeof v.valueOf() === 'string';
  }

  static isDate(d: any): boolean {
    return d instanceof Date;
  }

  static isFunction(f: any): boolean {
    return f && typeof f === 'function';
  }

  static toLower(s: string): string {
    return s ? s.toLowerCase() : null;
  }

  static toUpper(s: string): string {
    return s ? s.toUpperCase() : null;
  }

  static trim(s: string): string {
    return s ? s.trim() : null;
  }

  static startsWith(s: string, search: string, offset?: number): boolean {
    if (LoUtil.isString(s) && LoUtil.isString(search)) {
      return typeof offset === 'number' ? s.startsWith(search, offset) : s.startsWith(search);
    }
    return false;
  }

  static endsWidth(s: string, search: string, offset?: number): boolean {
    if (LoUtil.isString(s) && LoUtil.isString(search)) {
      return typeof offset === 'number' ? s.endsWith(search, offset) : s.endsWith(search);
    }
    return false;
  }

  static get<T>(obj: object, path: string, defaultValue?: T): T {
    const travel = regexp =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
  }

  static isArray(s: any): boolean {
    return Array.isArray(s);
  }
}
