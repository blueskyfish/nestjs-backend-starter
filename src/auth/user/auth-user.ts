
/**
 * Interface for the user data
 */
export interface IAuthData {

  /**
   * The primary key of the user
   */
  id: number;

  /**
   * The array of the roles for the user
   */
  roles: string[];
}


/**
 * The current user of the request. It is add to the express request with attribute name `authUser`.
 */
export class AuthUser<A extends IAuthData = IAuthData> {

  /**
   * The primary key of the user
   */
  get id(): number {
    return this.data.id || NaN;
  }

  /**
   * Create an instance of AuthUser.
   *
   * @param {A extends IAuthData} data the internal auth data.
   */
  constructor(public readonly data: A) {
  }

  /**
   * Check, whether the current user the role has.
   *
   * @param {string} role the role
   * @returns {boolean} `true` means the user has the role.
   */
  hasRole(role: string): boolean {
    if (!role) {
      return false;
    }
    return Array.isArray(this.data.roles) && this.data.roles.indexOf(role) >= 0;
  }
}
