
/**
 * The http header name for the authorization token
 */
export const HTTP_AUTH_HEADER = 'x-backend-starter';

export const API_KEY_NAME = 'ApiKey';

export const API_SECURITY: Record<string, string[]>[] = [{
  [API_KEY_NAME]: []
}];

/**
 * The configuration interface that is extending the {@link ICryptoConfig}
 *
 * * priKeyFilename
 * * pubKeyFilename
 *
 * * digest secret
 */
export interface IAuthConfig {


  /**
   * The filename of the private key content
   */
  readonly priKeyFilename;

  /**
   * The filename of the public key content
   */
  readonly pubKeyFilename;

  /**
   * Environment variable for the digest secret in order of hash the password of
   * the user. It could be a very long line of text.
   */
  digestSecret: string;
}
