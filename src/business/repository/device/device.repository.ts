import { Moment } from 'moment';
import { ValidUtil } from '../../../auth/util';
import { DbConnection } from '../../../common/database';
import { DateUtil } from '../../../common/util';
import { IRepository } from '../repository';
import {
  SQL_DELETE_DEVICE, SQL_DELETE_EXPIRED_DEVICES,
  SQL_INSERT_DEVICE,
  SQL_SELECT_DEVICE_COUNT,
  SQL_SELECT_USER_DEVICE_LIST, SQL_UPDATE_DEVICE_LAST_ACCESS,
  SQL_UPDATE_DEVICE_NAME
} from './device.sql';
import { IDbDeviceItem, IDbInsertDevice, IDbUpdateDeviceName } from './entities';

export class DeviceRepository implements IRepository {

  get conn(): DbConnection {
    return this._donn;
  }

  constructor(private _donn: DbConnection) {
  }

  async getDeviceItemList(userId: number): Promise<IDbDeviceItem[]> {
    return this.conn.select<IDbDeviceItem>(SQL_SELECT_USER_DEVICE_LIST, {userId});
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

  async updateDeviceLastAccess(deviceId: number, lastAccess: Moment): Promise<void> {
    const updateValues = {
      deviceId,
      lastAccess: DateUtil.formatTimestamp(lastAccess)
    };
    await this.conn.update(SQL_UPDATE_DEVICE_LAST_ACCESS, updateValues);
  }

  async deleteDevice(deviceId: number): Promise<void> {
    await this.conn.delete(SQL_DELETE_DEVICE, {deviceId});
  }

  async deleteExpiredDevices(expiresDate: Moment): Promise<number> {
    const deleteValues = {
      expiresDate: DateUtil.formatTimestamp(expiresDate)
    };
    return await this.conn.delete(SQL_DELETE_EXPIRED_DEVICES, deleteValues);
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
