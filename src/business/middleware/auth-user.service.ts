import { HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthUser } from '../../auth';
import { VerifierService } from '../../auth/verifier';
import { CommonError } from '../../common/error';
import { asyncForEach, DateUtil } from '../../common/util';
import { BusinessService } from '../business.service';
import { BusinessSettings } from '../business.settings';
import { AuthError } from '../errors';
import { RepositoryProvider } from '../repository';
import { DeviceRepository } from '../repository/device';
import { IDbDeviceItem } from '../repository/device/entities';
import { AuthUserMap } from './auth-user.map';
import { AuthUserDeviceStatus, IDeviceUpdate, LoaderDeviceFunc, } from './auth-user.models';


/**
 * The service use the auth user from the token and verified the user and the device.
 *
 * If the user device is reaching the expires time, then it thrown the error ({@link HttpStatus.UNAUTHORIZED}).
 */
@Injectable()
export class AuthUserService {

  private readonly authUserMap: AuthUserMap;

  constructor(
    private settings: BusinessSettings,
    private business: BusinessService,
    private verifier: VerifierService,
  ) {
    this.authUserMap = new AuthUserMap(settings.deviceExpires);
  }

  resetAuthUser(userId: number): void {
    this.authUserMap.resetAuthUser(userId);
  }

  /**
   * Verifies and builds the auth user. First it is extract the auth user from the token and then verified the
   * last access of the user device.
   *
   * @param {string} token the http header token.
   * @returns {Promise<AuthUser>} the auth user
   * @throws AuthError
   */
  async verifyAndBuildAuthUser(token: string): Promise<AuthUser> {

    let authUser: AuthUser = null;

    try {
      authUser = this.verifier.fromToken(token);
    } catch (e) {
      if (e instanceof CommonError) {
        console.error('> Error: Token is not valid => (%s.%s => %s)', e.group, e.code, e.message);
      }
      throw new AuthError('access', 'No access available');
    }


    // check user with device => status !== "okay" => AuthError
    return await this.business.openRepository(async (rep: RepositoryProvider) => {

      const status = await this.authUserMap.checkDevice(authUser.id, authUser.device, this.loaderDevice(rep.device));
      if (status !== AuthUserDeviceStatus.Okay) {
        console.warn('> Warn: User %s (d=%s) Status =>', authUser.id, authUser.device, status);
        throw new AuthError(status as string, 'Unauthorized access');
      }

      return authUser;
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {name: 'AuthUserService.saveLastAccess'})
  async saveDeviceLastAccess(): Promise<void> {
    console.debug('> Debug: [%s] Start to save from device list', DateUtil.formatTimestamp());

    const deviceList = this.authUserMap.getUpdatingDeviceList();
    if (deviceList.length === 0) {
      console.debug('> Debug: Nothing to save from the device list');
    }

    return this.business.openRepository(async (rep: RepositoryProvider) => {

      await rep.startTransaction();

      try {

        await asyncForEach(deviceList, async (value: IDeviceUpdate) => {

          switch (value.state) {
            case 'modified':
              await rep.device.updateDeviceLastAccess(value.deviceId, value.lastAccess);
              break;
            case 'deleting':
              await rep.device.deleteDevice(value.deviceId);
              break;
            default:
              console.warn('> Warn: device state "%s" is not handle (user %s, device %s => %s)',
                value.state, value.userId, value.deviceId, DateUtil.formatTimestamp(value.lastAccess)
              );
              break;
          }
        });

        await rep.commit();

      } catch (e) {
        await rep.rollback();
        console.error('> Error: Has occurred by save last of user devices (message=%s)', e.message);
      } finally {
        console.debug('> Debug: [%s] Finish to save the lastAccess', DateUtil.formatTimestamp());
      }
    });
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {name: 'AuthUserService.deleteExpiredDevices'})
  async deleteExpiredDevices(): Promise<void> {

    const expiresDate = this.authUserMap.getExpiresDate();
    console.debug('> Debug: [%s] Start delete expired devices', DateUtil.formatTimestamp());

    return this.business.openRepository(async (rep: RepositoryProvider) => {
      try {

        await rep.startTransaction();

        const affectedRows = await rep.device.deleteExpiredDevices(expiresDate);
        await rep.commit();

        console.info('> Info: Delete expired devices %s rows', affectedRows);

      } catch (e) {
        await rep.rollback();
        console.error('> Error: Expired devices failed to delete (%s)', e.message);
      } finally {
        console.debug('> Debug: [%s] Finish to delete expired devices', DateUtil.formatTimestamp());
      }
    });
  }

  private loaderDevice(device: DeviceRepository): LoaderDeviceFunc {
    return async (userId: number): Promise<IDbDeviceItem[]> => {
      return await device.getDeviceItemList(userId);
    };
  }
}
