import { MysqlUtil } from './mysql.util';


export const DEFAULT_TIMEOUT = 10000;
export const DEFAULT_CONNECT_LIMIT = 10;

/**
 * The default database host name
 */
export const DEFAULT_DB_HOST = 'localhost';

/**
 * The default database port
 */
export const DEFAULT_DB_PORT = 3306;


/**
 * Interface of the database configuration settings.
 */
export interface IMysqlConfig {

  /**
   * The type of database (always `mysql`)
   */
  readonly type: 'mysql';

  /**
   * The hostname of the database you are connecting to. (Default `localhost`)
   */
  readonly host?: string;

  /**
   * The port number to connect to. (Default: `3306`)
   */
  readonly port?: number;

  /**
   * **Required** The MySQL user to authenticate as.
   */
  readonly user: string;

  /**
   * **Required**: The password of that MySQL user.
   */
  readonly password: string;

  /**
   * **Required**: Name of the database to use for this connection.
   */
  readonly database: string;

  /**
   * The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: `10000`)
   */
  readonly connectTimeout?: number;

  /**
   * The maximum number of connections to create at once. (Default: `10`)
   */
  readonly connectLimit?: number;

  /**
   * The milliseconds before a timeout occurs during the connection acquisition. (Default `10000`)
   */
  readonly acquireTimeout?: number;

  /**
   * Determines the pool's action when no connections are available and the limit has been reached (Default `true`)
   */
  readonly waitForConnections?: boolean;

  /**
   * The maximum number of connection requests the pool will queue before returning an error from getConnection.
   *
   * If set to `0`, there is no limit to the number of queued connection requests. (Default: `0`)
   */
  readonly queueLimit?: number;
}

export class MysqlConfig implements IMysqlConfig {

  get type(): 'mysql' {
    return this.config.type;
  }

  /**
   * The hostname of the database you are connecting to. (Default `localhost`)
   */
  get host(): string {
    return MysqlUtil.getValue(DEFAULT_DB_HOST, this.config.host);
  }

  /**
   * The port number to connect to. (Default: `3306`)
   */
  get port(): number {
    return MysqlUtil.getValue(DEFAULT_DB_PORT, this.config.port);
  }

  /**
   * **Required** The MySQL user to authenticate as.
   */
  get user(): string {
    return this.config.user;
  }

  /**
   * **Required**: The password of that MySQL user.
   */
  get password(): string {
    return this.config.password;
  }

  /**
   * **Required**: Name of the database to use for this connection.
   */
  get database(): string {
    return this.config.database;
  }

  /**
   * The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: `10000`)
   */
  get connectTimeout(): number {
    return MysqlUtil.getValue<number>(DEFAULT_TIMEOUT, this.config.connectTimeout, DEFAULT_TIMEOUT);
  }

  /**
   * The maximum number of connections to create at once. (Default: `10`)
   */
  get connectLimit(): number {
    return MysqlUtil.getValue(DEFAULT_CONNECT_LIMIT, this.config.connectLimit, DEFAULT_CONNECT_LIMIT);
  }

  /**
   * The milliseconds before a timeout occurs during the connection acquisition. (Default `10000`)
   */
  get acquireTimeout(): number {
    return MysqlUtil.getValue(DEFAULT_TIMEOUT, this.config.acquireTimeout, DEFAULT_TIMEOUT);
  }


  /**
   * Determines the pool's action when no connections are available and the limit has been reached (Default `true`)
   */
  get waitForConnections(): boolean {
    return MysqlUtil.getValue(true, this.config.waitForConnections);
  }

  /**
   * The maximum number of connection requests the pool will queue before returning an error from getConnection.
   *
   * If set to `0`, there is no limit to the number of queued connection requests. (Default: `0`)
   */
  get queueLimit(): number {
    return MysqlUtil.getValue(0, this.config.queueLimit, 0);
  }

  constructor(private config: IMysqlConfig) {
  }
}
