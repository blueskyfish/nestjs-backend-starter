import { generate } from 'randomstring';

import { ValidUtil } from '../util';

const VERSION = 'v1';
const PREFIX = '<:';
const POSTFIX = ':>';
const SEPARATOR = ':><:';


/**
 * Internal helper function for extract values from formatted password
 *
 * @param {string} formattedPassword the password
 * @param {number} index the index of wanted value
 * @returns {string | null} the value or null
 */
function splitAndGet(formattedPassword: string, index: number): string | null {
  if (!ValidUtil.notEmpty(formattedPassword)) {
    return null;
  }

  if (!formattedPassword.startsWith(PREFIX) || !formattedPassword.endsWith(POSTFIX)) {
    return null;
  }

  const values = formattedPassword.substring(PREFIX.length, formattedPassword.length - POSTFIX.length);

  if (!ValidUtil.notEmpty(values)) {
    return null;
  }

  const parts = values.split(SEPARATOR);
  return parts[index] || null;
}

/**
 * Build the password from 3 parts
 * @param {string} salt the user salt
 * @param {string} password the hashed password
 * @returns {string} the formatted password for store and manage
 */
export function buildPassword(salt: string, password: string): string {
  return [
    PREFIX,
    VERSION,    // Index: 0
    SEPARATOR,
    salt,       // Index: 1
    SEPARATOR,
    password,   // Index: 2
    POSTFIX
  ].join('');
}

/**
 * Get the version information of the formatted password
 * @param {string} password the formatted password
 * @returns {string | null} the information or null if the parameter is invalid
 */
export function getVersion(password: string): string | null {
  return splitAndGet(password, 0);
}

/**
 * Get the user salt.
 *
 * @param {string} formattedPassword the password
 * @returns {string | null} the user salt or null
 */
export function getSalt (formattedPassword: string): string | null {
  return splitAndGet(formattedPassword, 1);
}

/**
 * Get the hashed password from the formatted password.
 *
 * @param {string} formattedPassword the password
 * @returns {string | null} the hashed password or null
 */
export function getPassword(formattedPassword: string): string | null {
  return splitAndGet(formattedPassword, 2);
}

/**
 * Generates an user salt
 * @returns {string}
 */
export function generateSalt(): string {
  return generate({
    length: 41,
    readable: true,
    charset: 'alphanumeric'
  });
}
