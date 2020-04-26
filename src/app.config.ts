
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

  /**
   * Environment variable for the filename of the private key
   */
  AuthPriFile = 'AUTH_PRI_FILE',

  /**
   * Environment variable for the filename of the public key
   */
  AuthPubFile = 'AUTH_PUB_FILE',

  /**
   * Environment variable for the name of the http header with the encrypted token of the current user
   */
  AuthHeader = 'AUTH_HEADER',

  /**
   * Environment variable for the time as days until the expires time is reaching.
   */
  AuthExpires = 'AUTH_EXPIRES',
}
