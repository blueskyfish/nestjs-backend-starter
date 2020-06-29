import { IDbConfig } from './database';
import { ISettingConfig } from './setting/setting.config';

/**
 * The extension of internal config interfaces
 */
export interface ICommonConfig extends IDbConfig, ISettingConfig{
}
