import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { SettingConfig } from './setting.config';

@Injectable()
export class SettingService {

  constructor(private config: SettingConfig) {
  }

  /**
   * The application home directory
   */
  get appHome(): string {
    return this.config.appHome;
  }

  /**
   * The application data directory
   */
  get appData(): string {
    return path.join(this.appHome, 'data');
  }

  /**
   * Get the filename from the application data directory
   * @param {string} filename the filename
   * @return {string} the full filename
   */
  getDataFile(filename: string): string {
    return path.join(this.appData, filename);
  }
}
