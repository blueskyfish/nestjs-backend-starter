/**
 * The `null` value in a sql statement
 * @type {string}
 */
export const NULL_VALUE = 'NULL';

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
