import { Moment } from 'moment';
import { DateUtil } from '../../common/util';
import {
  AuthUserDeviceStatus,
  IDeviceItem,
  IDeviceLastAccess,
  IDeviceUpdate,
  LoaderDeviceFunc,
  to
} from './auth-user.models';

/**
 * The class maps and manages the user with his device list.
 *
 * It is update the last access of the user device.
 */
export class AuthUserMap {

  /**
   * Maps the user with his devices (device id)
   *
   * @type {Map<number, number[]>}
   */
  private readonly userMap: Map<number, number[]> = new Map<number, number[]>();

  /**
   * Maps the device and the last access.
   *
   * @type {Map<number, IDeviceLastAccess>}
   */
  private readonly deviceMap: Map<number, IDeviceLastAccess> = new Map<number, IDeviceLastAccess>();

  /**
   * Initialized the auth user map.
   *
   * @param {number} expires the expires of the last access. The unit is seconds
   */
  constructor(private expires: number) {
    // console.log('> Trace: expires => %s seconds', expires);
  }

  resetAuthUser(userId: number): void {
    const deviceList = this.userMap.get(userId) || [];
    deviceList.forEach(deviceId => this.deviceMap.delete(deviceId));
    this.userMap.delete(userId);
  }


  /**
   * Check whether the user device is valid.
   *
   * @param {number} userId the user id
   * @param {number} deviceId the device id
   * @param {LoaderDeviceFunc} loaderDeviceFunc the callback for loading the devices of the user
   * @returns {Promise<AuthUserDeviceStatus>} the user device status
   */
  async checkDevice(userId: number, deviceId: number, loaderDeviceFunc: LoaderDeviceFunc): Promise<AuthUserDeviceStatus> {

    const expiresDate = this.getExpiresDate();

    if (!this.userMap.has(userId)) {
      // load the user device list
      const list = await loaderDeviceFunc(userId);
      this.updateUserDeviceList(expiresDate, userId, list);
    }

    const deviceList = this.userMap.get(userId);

    if (!this.userMap.has(userId) || !Array.isArray(deviceList) || deviceList.length === 0) {
      return AuthUserDeviceStatus.NotFound;
    }

    if (!deviceList.includes(deviceId)) {
      return AuthUserDeviceStatus.NotFound;
    }

    const value = this.deviceMap.get(deviceId);
    if (!value || value.state === 'deleting' || !expiresDate.isBefore(value.lastAccess)) {
      // expires is reaching
      this.deviceMap.set(deviceId, to('deleting', null, value.userId));
      return AuthUserDeviceStatus.Expires;
    }

    this.deviceMap.set(deviceId, to('modified', DateUtil.now(), value.userId));

    return AuthUserDeviceStatus.Okay;
  }

  /**
   * Get the list of devices that be updated
   *
   * @returns {IDeviceLastAccess[]}
   */
  getUpdatingDeviceList(): IDeviceUpdate[] {

    const expiresDate = this.getExpiresDate();

    const deleteList: number[] = [];
    const list: IDeviceUpdate[] = [];

    this.deviceMap.forEach((value: IDeviceLastAccess, deviceId: number) => {

      if (!expiresDate.isBefore(value.lastAccess) || value.state === 'deleting') {
        // the device has reaching the expires time.
        list.push({
          ...value,
          deviceId,
          state: 'deleting',
        });
        this.deleteDevice(value.userId, deviceId);
        deleteList.push(deviceId);
      } else if (value.state === 'modified') {

        list.push({
          ...value,
          deviceId,
        });
        value.state = 'saved';

      }
    });

    // remove the devices that are deleting before.
    if (deleteList.length > 0) {
      deleteList.forEach(deviceId => this.deviceMap.delete(deviceId));
    }

    return list;
  }

  private deleteDevice(userId: number, deviceId: number): void {
    const deviceList = this.userMap.get(userId) || [];
    const index = deviceList.indexOf(deviceId);
    if (index >= 0) {
      deviceList.slice(index, 1);
      this.userMap.set(userId, deviceList);
    }
  }

  private updateUserDeviceList(expiresDate: Moment, userId: number, list: IDeviceItem[]): void {
    // user device list
    const deviceList: number[] = [];

    // insert the devices into the device map
    list
      .map((d) => ({deviceId: d.deviceId, lastAccess: DateUtil.fromDate(d.lastAccess)}))
      .filter(d => expiresDate.isBefore(d.lastAccess))
      .forEach(d => {
        this.deviceMap.set(d.deviceId, to('saved', d.lastAccess, userId));
        deviceList.push(d.deviceId);
      });

    this.userMap.set(userId, deviceList);
  }

  /**
   * Get the expires date. It is the current datetime and subtract the expires seconds
   *
   * @returns {Moment}
   */
  getExpiresDate(): Moment {
    return DateUtil.now().subtract(this.expires, 'seconds');
  }
}
