/**
 * Internal error if a parameter is required
 */
export class RequiredError extends Error {

  /**
   * Create a required error
   * @param {string} param the parameter name
   * @param {string} message
   */
  constructor(public readonly param: string, message: string) {
    super(message);
  }
}
