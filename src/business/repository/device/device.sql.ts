import { NL } from '../../../common/database';
import { RepositoryNames } from '../repository.names';

/**
 * Insert (register) a new device of the user.
 */
export const SQL_INSERT_DEVICE = [
  'INSERT INTO ', RepositoryNames.Devices, ' SET', NL,
  '  `user_id` = {userId},', NL,
  '  `name` = {name},', NL,
  '  `creation` = {time},',
  '  `lastaccess` = {time}'
].join('');

/**
 * Update the device name of the user.
 */
export const SQL_UPDATE_DEVICE_NAME = [
  'UPDATE ', RepositoryNames.Devices, ' SET', NL,
  '  `name` = {name}', NL,
  'WHERE `device_id` = {deviceId}'
].join('');

export const SQL_SELECT_DEVICE_COUNT = [
  'SELECT COUNT(*) AS count', NL,
  'FROM ', RepositoryNames.Devices, NL,
  'WHERE `device_id` = {deviceId}'
].join('');


export const SQL_SELECT_USER_DEVICE_LIST = [
  'SELECT `device_id` as deviceId, `lastaccess` AS lastAccess', NL,
  'FROM ', RepositoryNames.Devices, NL,
  'WHERE `user_id` = {userId}'
].join('');


export const SQL_UPDATE_DEVICE_LAST_ACCESS = [
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
