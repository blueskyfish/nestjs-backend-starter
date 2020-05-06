import { Moment } from 'moment';
import { IDbDeviceItem } from '../repository/device/entities';

/**
 * The result of check the device
 */
export enum AuthUserDeviceStatus {

  /**
   * The user device has reach hist expires time
   */
  Expires = 'expires',

  /**
   * The device is not found
   */
  NotFound = 'notFound',

  /**
   * Device and user are okay and in time.
   */
  Okay= 'okay'
}

/**
 * The device state in the device map.
 *
 * * `saved` no saving is necessary. No change from last running save task
 * * `modified` The device last access must be saved in the next running save task
 * * `deleting` The device must delete in the next run of save task
 */
export type DeviceSaveState = 'saved' | 'modified' | 'deleting';

/**
 * The device record with it information about last access and user id
 */
export interface IDeviceLastAccess {

  /**
   * The state
   */
  state: DeviceSaveState;

  /**
   * The last access of the user with the device
   */
  lastAccess: Moment;

  /**
   * The user id
   */
  userId: number;
}

export interface IDeviceUpdate extends IDeviceLastAccess {

  /**
   * The device id
   */
  deviceId: number;
}

/**
 * Helper for create the instance of {@link IDeviceLastAccess}
 *
 * @param {DeviceSaveState} state the save state of the device
 * @param {Moment} lastAccess the last access of the user
 * @param {number} userId the user id for the link between user and his device
 * @returns {IDeviceLastAccess} the instance
 */
export const to = (state: DeviceSaveState, lastAccess: Moment, userId: number): IDeviceLastAccess => ( {state, lastAccess, userId } );


/**
 * Loader callback for get the list of devices and its last access from the given user.
 */
export type LoaderDeviceFunc = (userId: number) => Promise<IDbDeviceItem[]>
