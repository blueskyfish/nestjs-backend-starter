
/**
 * The default host of the backend server
 */
export const DEFAULT_HOST = 'localhost';


/**
 * The list of environment name
 */
export enum EnvName {

  /** Environment variable for the backend server host */
  Host = 'HOST',
  /** Environment variable for the backend server port */
  PORT = 'PORT',

  /**
   * The hostname of the database you are connecting to. (Default `localhost`)
   */
  DbHost = 'DB_HOST',

  /**
   * The port number to connect to. (Default: `3306`)
   */
  DbPort = 'DB_PORT',

  /**
   * **Required** The MySQL user to authenticate as.
   */
  DbUser = 'DB_USER',

  /**
   * **Required**: The password of that MySQL user.
   */
  DbPassword = 'DB_PASSWORD',

  /**
   * **Required**: Name of the database to use for this connection.
   */
  DbDatabase = 'DB_DATABASE',

  /**
   * The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: `10000`)
   */
  DbConnectTimeout = 'DB_CONNECT_TIMEOUT',

  /**
   * The maximum number of connections to create at once. (Default: `10`)
   */
  DbConnectLimit = 'DB_CONNECT_LIMIT',

  /**
   * The milliseconds before a timeout occurs during the connection acquisition. (Default `10000`)
   */
  DbAcquireTimeout = 'DB_ACQUIRE_TIMEOUT',

  /**
   * Determines the pool's action when no connections are available and the limit has been reached (Default `true`)
   */
  DbWaitForConnections = 'DB_WAIT_FOR_CONNECTIONS',

  /**
   * The maximum number of connection requests the pool will queue before returning an error from getConnection.
   *
   * If set to `0`, there is no limit to the number of queued connection requests. (Default: `0`)
   */
  DbQueueLimit = 'DB_QUEUE_LIMIT',

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
