/**
 * The `null` value in a sql statement
 * @type {string}
 */
export const NULL_VALUE = 'NULL';

/**
 * The provider token for the database configuration
 *
 * TODO Adjust the token name
 */
export const DB_CONFIG_TOKEN = 'nestjs.backend.common.dbConfig';

export const NL = '\n';

/**
 * Interface of the database configuration settings.
 */
export interface IDbConfig {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly connectLimit: number;
}

export class DbConfig implements IDbConfig {

  get host(): string {
    return this.config.host;
  }

  get port(): number {
    return this.config.port;
  }

  get user(): string {
    return this.config.user;
  }

  get password(): string {
    return this.config.password;
  }

  get database(): string {
    return this.config.database;
  }

  get connectLimit(): number {
    return this.config.connectLimit || 10
  }

  constructor(private config: IDbConfig) {
  }
}
