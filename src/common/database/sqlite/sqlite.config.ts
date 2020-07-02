import * as _ from 'lodash';
import { OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';

/**
 * The in memory database
 */
export const MEMORY_DB = ':memory:';

export const DEFAULT_MODE = OPEN_READWRITE | OPEN_CREATE;

export const SQLITE_GROUP = 'sqlite';

export interface ISqliteConfig {

  readonly type: 'sqlite';

  /**
   * The filename or in memory
   */
  readonly filename?: string;

  readonly mode?: number;
}

export class SqliteConfig implements ISqliteConfig {

  constructor(private config: ISqliteConfig) {
  }

  get type(): 'sqlite' {
    return this.config.type;
  }

  get filename(): string {
    return _.isNil(this.config.filename) ? MEMORY_DB : this.config.filename;
  }

  get mode(): number {
    return _.isNil(this.config.mode) ? DEFAULT_MODE : this.config.mode;
  }

  toString(): string {
    return `sqlite (${this.filename} => ${this.mode})`;
  }
}
