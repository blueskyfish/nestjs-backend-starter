
/**
 * Record of the device id and last access from an user
 */
export interface IDbDeviceItem {
  deviceId: number;
  lastAccess: Date | string;
}
