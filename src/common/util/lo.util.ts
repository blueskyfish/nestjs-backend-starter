
export class LoUtil {

  static isNil(v: any): boolean {
    return v === null || typeof v === 'undefined';
  }

  static isString(v: any): boolean {
    return v && typeof v.valueOf() === 'string';
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

  static isArray(s: any): boolean {
    return Array.isArray(s);
  }
}
