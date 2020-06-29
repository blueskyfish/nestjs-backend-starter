import * as moment from 'moment';
import { DurationInputArg2, Moment } from 'moment';
import * as _ from 'lodash';
import 'moment-duration-format';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * Callback pattern for the {@link DateUtil.repeatUntil} function
 */
export type RepeatUntilFunc = (date: Moment) => Moment;

/**
 * An utility class for date and datetime functions
 */
export class DateUtil {

  static now(): Moment {
    return moment();
  }

  static formatTimestamp(m?: Moment | Date): string {
    if (_.isDate(m)) {
      m = moment(m);
    }
    if (!m) {
      m = DateUtil.now();
    }
    return m.format(TIMESTAMP_FORMAT);
  }

  static formatDate(m: Moment | Date | string): string {
    if (_.isString(m) || _.isDate(m)) {
      m = moment(m);
    }
    return m.format(DATE_FORMAT);
  }

  static format(m: Moment, format?: string) {
    if (!format) {
      format = DATE_FORMAT;
    }

    return m.format(format);
  }

  static formatTime(m: Moment): string {
    return m.format(TIME_FORMAT);
  }

  static toMoment(date: string, time: string): Moment {
    const d = moment(date, DATE_FORMAT);
    const m = moment(time, TIME_FORMAT);

    return d.add(m.hour(), 'hour').add(m.minute(), 'minute');
  }

  static fromDate(date: string | Date): Moment {
    if (_.isDate(date)) {
      return moment(date);
    }
    return moment(date, DATE_FORMAT);
  }

  static dateTime(d: Date): Moment {
    return moment(d);
  }

  static formatDateTime(m?: Moment): string {
    if (!m) {
      m = DateUtil.now();
    }
    return `${DateUtil.formatDate(m)} ${DateUtil.formatTime(m)}`;
  }

  static date1970(): Moment {
    return DateUtil.fromDate('1970-01-01');
  }

  /**
   * Repeat until the callback is return `null`.
   *
   * @param {moment.Moment} start the start date (moment)
   * @param {RepeatUntilFunc} func the callback function
   */
  static repeatUntil(start: Moment, func: RepeatUntilFunc): void {
    let date = start;
    while (true) {
      date = func(date.clone());
      if (_.isNil(date)) {
        break;
      }
    }
  }

  /**
   * formatting the duration.
   *
   * @param {number | Date | moment.Moment} diff the different as number or Date or Moment
   * @param {moment.unitOfTime.DurationAs} unit the unit of the duration
   * @param {string} formatPattern the patting of output
   * @return {string}
   */
  static formatDuration(diff: number | Date | Moment, unit: DurationInputArg2, formatPattern: string): string {
    if (_.isDate(diff)) {
      diff = moment(diff);
    }
    if (moment.isMoment(diff)) {
      diff = diff.diff(DateUtil.now(), unit)
    }
    return moment.duration(diff, unit).format(formatPattern);
  }
}
