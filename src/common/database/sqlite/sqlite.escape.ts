import * as _ from 'lodash';
import  { Moment } from 'moment';
import * as moment from 'moment';
import { DateUtil } from '../../util';
import { NULL_VALUE } from '../db.config';

export class SqliteEscape {

  static escapeQuery(query: string, values: any): string {

    if (_.isNull(values) || _.size(values) === 0) {
      return query;
    }
    return query.replace(/{([a-zA-Z0-9]+)?}/g, (text, key) => {
      if (values.hasOwnProperty(key)) {
        const item = values[key];
        if (Array.isArray(item)) {
          // concat the values with comma separate
          return item.map((v) => SqliteEscape.escape(v)).join(',');
        }
        if (_.isNil(item)) {
          return NULL_VALUE;
        }
        // 'NULL' is sql NULL :-)
        if (item === NULL_VALUE) {
          return NULL_VALUE;
        }
        return SqliteEscape.escape(values[key]);
      }
      return text;
    });
  }

  static escape(value: any): string {
    const type = typeof value;
    switch (type) {
      case 'undefined':
        return NULL_VALUE;
      case 'bigint':
      case 'number':
        return `${value}`;
      case 'boolean':
        return value ? 'true' : 'false';
      case 'object':
        if (moment.isDate(value) || moment.isMoment(value)) {
          return SqliteEscape.escapeDate(value);
        } else if (Buffer.isBuffer(value)) {
          return SqliteEscape.escapeBuffer(value);
        } else if (_.isNil(value)) {
          return NULL_VALUE;
        }
        return SqliteEscape.escapeString(JSON.stringify(value));
      case 'string':
        return SqliteEscape.escapeString(value);
      default:
        return SqliteEscape.escapeString(`${value}`);
    }
  }

  static escapeBuffer(buffer: Buffer): string {
    return `X${SqliteEscape.escapeString(buffer.toString('hex'))}`;
  }

  static escapeDate(date: Moment | Date): string {
    return SqliteEscape.escapeString(DateUtil.formatTimestamp(date));
  }

  static escapeString(s: string): string {
    if (_.isNil(s)) {
      return ''
    }
    return `'${s.replace(/[']/gm, '\'\'')}'`;
  }
}
