import { ICryptoConfig } from './crypto';
import { ITokenConfig } from './token';
import { IAuthMiddlewareConfig } from './web';

/**
 * The configuration interface that is extending the {@link ICryptoConfig}, {@link ITokenConfig} and
 * {@link IAuthMiddlewareConfig}
 *
 * * priKeyFilename
 * * pubKeyFilename
 * * expires
 * * headerName
 */
export interface IAuthConfig extends ICryptoConfig, ITokenConfig, IAuthMiddlewareConfig {
}
