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
