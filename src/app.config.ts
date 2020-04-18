
/**
 * The default host of the backend server
 */
export const DEFAULT_HOST = 'localhost';

/**
 * The default database host name
 */
export const DEFAULT_DB_HOST = 'localhost';

/**
 * The default database port
 */
export const DEFAULT_DB_PORT = 3306;

/**
 * The list of environment name
 */
export enum EnvName {

  /** Environment variable for the backend server host */
  Host = 'HOST',
  /** Environment variable for the backend server port */
  PORT = 'PORT',

  DbHost = 'DB_HOST',
  DbPort = 'DB_PORT',
  DbUser = 'DB_USER',
  DbPassword = 'DB_PASSWORD',
  DbDatabase = 'DB_DATABASE',
}
