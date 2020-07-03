import { HttpStatus } from '@nestjs/common';
import { MysqlError } from 'mysql';
import { CommonError } from '../error';
import { MysqlUtil } from './mysql';

export const DB_ERROR_GROUP = 'db';

export class DbError extends CommonError {

  constructor(code: string, message: string, sql?: string, stack?: string) {
    super(HttpStatus.BAD_REQUEST, DB_ERROR_GROUP, code, message, {
      sql,
    });
    this.stack = stack;
  }
}

export class SqliteError extends CommonError {

  constructor(code: string, message: string, data?: any) {
    super(HttpStatus.BAD_REQUEST, DB_ERROR_GROUP, code, message, data);
  }
}

export const transactionError = (err: MysqlError): DbError => {
  const code = MysqlUtil.adjustAndLower(err.code, '.');
  const message = err.sqlMessage;

  return new DbError(`transaction.${code}`, message);
};

/**
 * Create a DB error for query request to the database. The error code has the prefix **query**.
 * @param {MysqlError} err the error of the database
 * @returns {DbError} the db error
 */
export const queryError = (err: MysqlError): DbError => {

  const code = MysqlUtil.adjustAndLower(err.code, '.');
  const message = err.sqlMessage;
  const sql = err.sql;

  return new DbError(`query.${code}`, message, sql, err.stack);
};

export const connectError = (err: MysqlError): DbError => {

  const code = MysqlUtil.adjustAndLower(err.code, '.');
  const message = err.sqlMessage;

  return new DbError(`connect.${code}`, message);
};
