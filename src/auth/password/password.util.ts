import { generate } from 'randomstring';

import { ValidUtil } from '../util';

const VERSION = 'v1';
const PREFIX = '<:';
const POSTFIX = ':>';
const SEPARATOR = ':><:';

export const buildPassword = (salt: string, password: string): string => {
  return [
    PREFIX,
    VERSION,    // Index: 0
    SEPARATOR,
    salt,       // Index: 1
    SEPARATOR,
    password,   // Index: 2
    POSTFIX
  ].join('');
};

export const getVersion = (hashedPassword: string): string | null => {
  return splitAndGet(hashedPassword, 0);
};

export const getSalt = (hashedPassword: string): string | null => {
  return splitAndGet(hashedPassword, 1);
};

export const getPassword = (hashedPassword: string): string | null => {
  return splitAndGet(hashedPassword, 2);
};

export const generateSalt = (): string => {
  return generate({
    length: 41,
    readable: true,
    charset: 'alphanumeric'
  });
}

function splitAndGet(hashedPassword: string, index: number): string | null {
  if (!ValidUtil.notEmpty(hashedPassword)) {
    return null;
  }

  if (!hashedPassword.startsWith(PREFIX) || !hashedPassword.endsWith(POSTFIX)) {
    return null;
  }

  const values = hashedPassword.substring(PREFIX.length, hashedPassword.length - POSTFIX.length);

  if (!ValidUtil.notEmpty(values)) {
    return null;
  }

  const parts = values.split(SEPARATOR);
  return parts[index];
}
