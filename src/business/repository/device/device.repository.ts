import { ValidUtil } from '../../../auth/util';
import { DbConnection } from '../../../common/database';
import { IRepository } from '../repository';
import { SQL_INSERT_DEVICE, SQL_SELECT_DEVICE_COUNT, SQL_UPDATE_DEVICE_NAME } from './device.sql';
import { IDbInsertDevice, IDbUpdateDeviceName } from './entities';

export class DeviceRepository implements IRepository {

  get conn(): DbConnection {
    return this._donn;
  }

  constructor(private _donn: DbConnection) {
  }

  async insertDevice(values: IDbInsertDevice): Promise<number> {
    return await this.conn.insert(SQL_INSERT_DEVICE, values);
  }

  /**
   * Update the device name of the user
   * @param {IDbUpdateDeviceName} values
   * @returns {Promise<void>}
   */
  async updateDeviceName(values: IDbUpdateDeviceName): Promise<void> {
    await this.conn.update(SQL_UPDATE_DEVICE_NAME, values);
  }

  /**
   * Check whether the device id is available
   *
   * @param {number} deviceId the device id
   * @returns {Promise<boolean>} `true` means the device is existing
   */
  async existDevice(deviceId: number): Promise<boolean> {
    const result = await this.conn.selectOne<{count: number}>(SQL_SELECT_DEVICE_COUNT, {deviceId});
    return ValidUtil.isPositiv(result?.count);
  }

  close(): void {
    this._donn = null;
  }
}
