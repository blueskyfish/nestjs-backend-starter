import * as _ from 'lodash';

export class DbResult<T> {

  /**
   * Check whether the sql result is an array
   *
   * @returns {boolean}
   */
  get hasList(): boolean {
    return _.isArray(this.result);
  }

  /**
   * Get the sql result as array of given type.
   *
   * **NOTE** If the sql result is not an array, then it returns an empty array.
   *
   * @returns {*[]} the list of given type
   */
  get asList(): T[] {
    return this.hasList ? this.result : [];
  }

  constructor(private result: T | any) {
  }

  /**
   * Get the insert id after executes the "INSERT INFO..." statement
   *
   * @returns {number} `NaN` means: there is no insertId available
   */
  insertId(): number {
    return _.get(this.result, 'insertId', NaN);
  }

  /**
   * Get the affected rows after executes the "DELETE FROM..." statement
   *
   * @returns {number} `NaN` means: there is no insertId available
   */
  affectedRows(): number {
    return _.get(this.result, 'affectedRows', NaN);
  }

  /**
   * Get the changed rows after executes the "UPDATE..." statement
   *
   * @returns {number} `NaN` means: there is no insertId available
   */
  changedRows(): number {
    return _.get(this.result, 'changedRows', NaN);
  }
}
