import * as path from 'path';
import * as os from 'os';
import { LoUtil, NumberUtil } from '../util';

/**
 * The user home directory
 */
export const HomePath = os.homedir();

/**
 * An environment value
 */
export class EnvValue {

  /**
   * Returns the value as string.
   *
   * @returns {string}
   */
  get asString(): string {
    return this.value;
  }

  /**
   * Returns the values as number.
   *
   * @returns {number} returns a number or `NaN`.
   */
  get asNumber(): number {
    return NumberUtil.toInt(this.value);
  }

  /**
   * Returns the value as boolean. If the result is null, then it could not interpreted as boolean
   *
   * @returns {boolean} return a boolean or `null`
   */
  get asBool(): boolean {
    if (LoUtil.isNil(this.value)) {
      return null;
    }
    if (LoUtil.toLower(this.value) === 'true') {
      return true;
    } else if (LoUtil.toLower(this.value) === 'false') {
      return false;
    }
    const no = NumberUtil.toInt(this.value);
    if (isNaN(no)) {
      return null;
    }
    return no > 0;
  }

  /**
   * Returns the environment variable as filename. It is replace the `{HOME}` and `{CWD}` keys and normalize the path.
   *
   * @returns {string}
   */
  get asFilename(): string {
    const value = this.asString;
    if (LoUtil.isNil(value)) {
      return null;
    }
    return path.normalize(value
      .replace('{HOME}', HomePath)
      .replace('{CWD}', process.cwd)
    );
  }

  get hasValue(): boolean {
    return !!this.value;
  }

  constructor(private value: string) {
  }
}

/**
 * Get a {@link EnvValue} instance from the given environment name. The name is not case sensitive.
 *
 * @param {string} name the name of the environment variable
 * @returns {EnvValue} an environment value instance. It is new returns `null`.
 */
export const fromEnv = (name: string): EnvValue => {
  if (!name) {
    return new EnvValue(null);
  }

  const loName = name.toLowerCase();
  const upName = name.toUpperCase();

  const value = process.env[upName] || process.env[loName] || process.env[name] || null;
  return new EnvValue(value);
};

/**
 * Update an environment variable.
 *
 * @param {string} name the name
 * @param {string} value the value
 */
export const setEnv = (name: string, value: string): void => {
  process.env[name.toUpperCase()] = value;
};
