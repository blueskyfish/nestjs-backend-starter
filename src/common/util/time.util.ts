
const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * Manages the timestamps
 */
export class TimeUtil {

  /**
   * The current seconds since January 1, 1970 00:00:00 UTC
   *
   * @returns {number}
   */
  static now(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get the seconds from name plus the given minutes, hours and days.
   *
   * @param {number} minutes the given minutes
   * @param {number} hours the hours (default is `0`)
   * @param {number} days the days (default is `0`)
   * @returns {number} the seconds from now plus delta
   */
  static fromNow(minutes: number, hours = 0, days = 0): number {
    return TimeUtil.now() +
      TimeUtil.fromMinutes(minutes) +
      TimeUtil.fromHours(hours) +
      TimeUtil.fromDays(days);
  }

  /**
   * Calculate the seconds from the given Minutes
   *
   * **NOTE**: minutes less `0` are negative seconds
   *
   * @param {number} minutes the given minutes
   * @returns {number} the seconds
   */
  static fromMinutes(minutes: number): number {
    return Math.floor(minutes) * ONE_MINUTE;
  }

  /**
   * Calculate the seconds from the given hours.
   *
   * **NOTE**: hours less `0` are negative seconds
   *
   * @param {number} hours the given hours
   * @returns {number} the seconds
   */
  static fromHours(hours: number): number {
    return Math.floor(hours) * ONE_HOUR;
  }

  /**
   * Calculates the seconds from the given days.
   *
   * **NOTE**: days less `0` are negative seconds
   *
   * @param {number} days the given days
   * @returns {number} the seconds
   */
  static fromDays(days: number): number {
    return Math.floor(days) * ONE_DAY;
  }
}
