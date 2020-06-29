import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';
import * as _ from 'lodash';
import { SettingService } from '../../common/setting/setting.service';
import { About } from './entity';

const readFileAsync = promisify(fs.readFile);

@Injectable()
export class SystemService {

  private aboutData: About = null;

  constructor(private setting: SettingService) {
  }

  getHello(name: string): string {
    return `Hello ${name || 'World'}!`;
  }

  /**
   * Get the about information
   * @return {Promise<About>}
   */
  async getAbout(): Promise<About> {
    if (_.isNil(this.aboutData)) {
      (this.aboutData as any) = {};
      const filename = this.setting.getDataFile('about.json');
      const value = await readFileAsync(filename, 'utf8');
      this.aboutData = JSON.parse(value);
    }
    return this.aboutData;
  }
}
