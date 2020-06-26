import { ICryptoConfig } from './crypto';

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
 */
export interface IAuthConfig extends ICryptoConfig {
}
