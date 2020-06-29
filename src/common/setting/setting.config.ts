export interface ISettingConfig {

  /**
   * the application home directory
   */
  appHome: string;
}

/**
 * The configuration of the setting service
 */
export class SettingConfig {

  /**
   * @param {string} config the setting config
   */
  constructor(private config: ISettingConfig) {}

  get appHome(): string {
    return this.config.appHome;
  }
}
