import { DateTime, Duration, DurationUnit } from 'luxon';
import { LoUtil } from './lo.util';

const DATE_FORMAT = 'yyyy-LL-dd';
const TIME_FORMAT = 'HH:mm';
const TIMESTAMP_FORMAT = 'yyyy-LL-dd HH:mm:ss';

/**
 * Callback pattern for the {@link DateUtil.repeatUntil} function
 */
export type RepeatUntilFunc = (date: DateTime) => DateTime;

/**
 * An utility class for date and datetime functions
 */
export class DateUtil {

  static now(): DateTime {
    return DateTime.local();
  }

  static formatTimestamp(m?: DateTime | Date): string {
    if (LoUtil.isDate(m)) {
      m = DateTime.fromJSDate(m as Date)
    }
    if (!m) {
      m = DateUtil.now();
    }
    return (m as DateTime).toFormat(TIMESTAMP_FORMAT);
  }

  static formatDate(m: DateTime | Date | string): string {
    if (LoUtil.isString(m) || LoUtil.isDate(m)) {
      m = DateTime.fromJSDate(m as Date);
    }
    return (m as DateTime).toFormat(DATE_FORMAT);
  }

  static format(m: DateTime, format?: string) {
    if (!format) {
      format = DATE_FORMAT;
    }

    return m.toFormat(format);
  }

  static formatTime(m: DateTime): string {
    return m.toFormat(TIME_FORMAT);
  }

  static toMoment(date: string, time: string): DateTime {
    const d = DateTime.fromFormat(date, DATE_FORMAT);
    const m = DateTime.fromFormat(time, TIME_FORMAT);

    return d.plus({hours: m.hour, minutes: m.minute});
  }

  static fromDate(date: string | Date): DateTime {
    if (LoUtil.isDate(date)) {
      return DateTime.fromJSDate(date as Date);
    }
    return DateTime.fromFormat(date as string, DATE_FORMAT);
  }

  static dateTime(d: Date): DateTime {
    return DateTime.fromJSDate(d);
  }

  static formatDateTime(m?: DateTime): string {
    if (!m) {
      m = DateUtil.now();
    }
    return `${DateUtil.formatDate(m)} ${DateUtil.formatTime(m)}`;
  }

  static date1970(): DateTime {
    return DateUtil.fromDate('1970-01-01');
  }

  /**
   * Repeat until the callback is return `null`.
   *
   * @param {moment.Moment} start the start date (moment)
   * @param {RepeatUntilFunc} func the callback function
   */
  static repeatUntil(start: DateTime, func: RepeatUntilFunc): void {
    let date = start;
    while (true) {
      date = func(date);
      if (LoUtil.isNil(date)) {
        break;
      }
    }
  }

  /**
   * formatting the duration.
   *
   * @param {number | Date | moment.Moment} value the different as number or Date or Moment
   * @param {moment.unitOfTime.DurationAs} unit the unit of the duration
   * @param {string} formatPattern the patting of output
   * @return {string}
   */
  static formatDuration(value: number |  Date | DateTime, unit: DurationUnit, formatPattern: string): string {
    let diff: Duration = null;

    if (typeof value === 'number') {
      value = DateTime.fromSeconds(value)
    }
    if (LoUtil.isDate(value)) {
      value = DateTime.fromJSDate(value as Date);
    }
    if (DateTime.isDateTime(value)) {
      diff = DateUtil.now().diff(value, unit);
    }

    return LoUtil.isNil(diff) ? null : diff.toFormat(formatPattern);
  }
}
