import { NL } from '../../common/database';
import { RepositoryNames } from '../repository/repository.names';

export const SQL_SELECT_USER_DEVICE_LIST = [
  'SELECT `device_id` as deviceId, `lastaccess` AS lastAccess', NL,
  'FROM ', RepositoryNames.Devices, NL,
  'WHERE `user_id` = {userId}'
].join('');


export const SQL_UPDATE_DEVICE = [
  'UPDATE ', RepositoryNames.Devices, ' SET', NL,
  '  `lastaccess` = {lastAccess}', NL,
  'WHERE `device_id` = {deviceId}'
].join('');

export const SQL_DELETE_DEVICE = [
  'DELETE FROM ', RepositoryNames.Devices, NL,
  'WHERE `device_id` = {deviceId}'
].join('');

/**
 * Delete all expired devices
 */
export const SQL_DELETE_EXPIRED_DEVICES = [
  'DELETE FROM ', RepositoryNames.Devices, NL,
  'WHERE `lastaccess` < {expiresDate}'
].join('')
