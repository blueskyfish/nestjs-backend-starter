/**
 * // TODO: "Shortcut" => Rename the "com.backend.nest.start" with your project specifications
 *
 */
export const TOKEN_CONFIG = 'com.backend.nest.start.auth.tokenConfig';


export interface ITokenConfig {

  /**
   * The expires in seconds
   */
  expires: number;
}

export class TokenConfig {

  constructor(public readonly expires: number) {
  }
}
