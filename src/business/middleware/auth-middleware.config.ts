
/**
 * // TODO: "Shortcut" => Rename the "com.backend.nest.start" with your project specifications
 */
export const AUTH_MIDDLEWARE_CONFIG = 'com.backend.nest.start.auth.middlewareConfig';

/**
 * The auth middleware configuration
 */
export interface IAuthMiddlewareConfig {

  /**
   * The http header name
   */
  headerName: string;
}

export class AuthMiddlewareConfig {

  constructor(public readonly headerName: string) {
  }
}

