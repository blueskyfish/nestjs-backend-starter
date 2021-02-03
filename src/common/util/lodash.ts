/*!
 * Small helper class for replace [lodash](https://lodash.com/)
 *
 * **Reason**
 *
 * * TreeShacking
 *
 * @see <https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore>
 */

export function isNil(v: any): boolean {
  return v === null || typeof v === 'undefined';
}

export function isEmpty(v: any): boolean {
  if (isNil(v)) {
    return true;
  }
  if (isString(v) || Array.isArray(v)) {
    return v.length === 0;
  }
  return Object.keys(v).length === 0;
}

export function isString(v: any): boolean {
  return !isNil(v) && typeof v.valueOf() === 'string';
}

export function isDate(d: any): boolean {
  return d instanceof Date;
}

export function isFunction(f: any): boolean {
  return f && typeof f === 'function';
}

export function toLower(s: string): string {
  return s ? s.toLowerCase() : null;
}

export function toUpper(s: string): string {
  return s ? s.toUpperCase() : null;
}

export function trim(s: string): string {
  return s ? s.trim() : null;
}

export function startsWith(s: string, search: string, offset?: number): boolean {
  if (isString(s) && isString(search)) {
    return typeof offset === 'number' ? s.startsWith(search, offset) : s.startsWith(search);
  }
  return false;
}

export function endsWidth(s: string, search: string, offset?: number): boolean {
  if (isString(s) && isString(search)) {
    return typeof offset === 'number' ? s.endsWith(search, offset) : s.endsWith(search);
  }
  return false;
}

export function get<T>(obj: object, path: string, defaultValue?: T): T {
  const travel = regexp =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

export function size(s: any): number {
  if (isNil(s)) {
    return -1;
  }
  if (isString(s)) {
    return s.length;
  }
  if (Array.isArray(s)) {
    return s.length;
  }
  return Object.keys(s).length;
}

export function forEach(s: any, callbackFunc: (element, index, array) => void): void {
  if (Array.isArray(s)) {
    s.forEach((element, index, array) => callbackFunc(element, index, array));
  } else if (typeof s === 'object') {
    Object.keys(s).forEach((attribute) => callbackFunc(s[attribute], attribute, s));
  }
}

