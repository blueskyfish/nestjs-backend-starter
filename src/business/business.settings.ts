import { IBusinessConfig } from './business.config';

/**
 * The business settings
 */
export class BusinessSettings {

  /**
   * The expires time in seconds
   */
  get deviceExpires(): number {
    return this.config.deviceExpires;
  }

  constructor(private config: IBusinessConfig) {
  }
}
