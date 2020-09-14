
export enum Stage {

  /**
   * Logs all upper (debug ...)
   */
  Develop = 'develop',

  /**
   * Logs all (trace ...
   */
  Test = 'test',

  /**
   * Logs all upper (info ...)
   */
  Int = 'int',

  /**
   * Log all upper (warn ...)
   */
  Prod = 'prod'
}

export interface ILogConfig {

  /**
   * The log stage
   */
  readonly stage: Stage,

}

export class LogConfig implements ILogConfig {

  get stage(): Stage {
    return this.config.stage;
  }

  constructor(private config: ILogConfig) {
  }
}

