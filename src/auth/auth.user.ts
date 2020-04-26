
/**
 * Interface for the user data
 */
export interface IAuthData {

  /**
   * The primary key of the user
   */
  id: number;

  /**
   * The number of device
   */
  device: number;

  /**
   * The array of the roles for the user
   */
  roles: string[];

  /**
   * The timestamp (second from since January 1, 1970 00:00:00 UTC)
   */
  creation: number;

  /**
   * The expires time
   */
  expires: number;
}


/**
 * The current user of the request. It is add to the express request with attribute name `authUser`.
 */
export class AuthUser {

  /**
   * The primary key of the user
   */
  get id(): number {
    return this.data.id || NaN;
  }

  /**
   * The number of device
   */
  get device(): number {
    return this.data.device || NaN;
  }

  constructor(private data: IAuthData) {
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
