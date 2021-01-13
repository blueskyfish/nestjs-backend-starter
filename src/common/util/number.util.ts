import { isNil } from './lo.util';

/**
 * Converts the string into a number.
 *
 * @param {string | number} s the value
 * @returns {number} in case of failed it returns `NaN`.
 */
export function toInt(s: string|number): number {

    if (isNil(s)) {
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

export function toFixed(s: number | string, digit = 2): string {
    if (typeof s === 'string') {
      s = toInt(s);
    }
    if (isNaN(s)) {
      return null;
    }
    return s.toFixed(digit);
  }

export function adjustInt(value: number, min: number, max: number): number {
    if (isNaN(value) || value < min) {
      value = min;
    }
    if (value > max) {
      value = max;
    }
    return value;
  }

