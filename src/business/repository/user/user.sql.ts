import { NL } from '../../../common/database';
import { RepositoryNames } from '../repository.names';

/**
 * Search for the user with given email.
 */
export const SQL_FIND_USER_BY_EMAIL = [
  'SELECT `user_id` as userId, `name`, `email`, `roles`, `password`', NL,
  'FROM ', RepositoryNames.Users, NL,
  'WHERE `email` = {email}'
].join('');

/**
 * Search for the user by the given id.
 */
export const SQL_FIND_USER_BY_ID = [
  'SELECT `user_id` as userId, `name`, `email`, `roles`, `password`', NL,
  'FROM ', RepositoryNames.Users, NL,
  'WHERE `user_id` = {userId}'
].join('')


/**
 * Search for the user id from the given email
 */
export const SQL_FIND_USER_FROM_EMAIL = [
  'SELECT `user_id` AS userId', NL,
  'FROM ', RepositoryNames.Users, NL,
  'WHERE `email` = {email}'
].join('');

/**
 * Insert a new user
 */
export const SQL_INSERT_USER = [
  'INSERT INTO ', RepositoryNames.Users, ' SET', NL,
  '  `name` = {name},', NL,
  '  `email` = {email},', NL,
  '  `password` = {password},', NL,
  '  `roles` = {roles}'
].join('');
