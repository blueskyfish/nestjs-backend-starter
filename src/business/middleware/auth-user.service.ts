import { Injectable, HttpStatus } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { AuthUser } from '../../auth/auth.user';
import { VerifierService } from '../../auth/verifier';
import { DbConnection, DbService } from '../../common/database';
import { CommonError } from '../../common/error';
import { asyncForEach, DateUtil, SecondUtil } from '../../common/util';
import { BusinessSettings } from '../business.settings';
import { AuthError } from '../errors';
import { AuthUserMap } from './auth-user.map';
import {
  AuthUserDeviceStatus,
  IDeviceItem,
  IDeviceLastAccess,
  IDeviceUpdate,
  LoaderDeviceFunc
} from './auth-user.models';
import {
  SQL_DELETE_DEVICE,
  SQL_DELETE_EXPIRED_DEVICES,
  SQL_SELECT_USER_DEVICE_LIST,
  SQL_UPDATE_DEVICE
} from './auth-user.sql';

/**
 * The service use the auth user from the token and verified the user and the device.
 *
 * If the user device is reaching the expires time, then it thrown the error ({@link HttpStatus.UNAUTHORIZED}).
 */
@Injectable()
export class AuthUserService {

  private readonly authUserMap: AuthUserMap;

  constructor(private settings: BusinessSettings, private verifier: VerifierService, private dbService: DbService) {
    this.authUserMap = new AuthUserMap(settings.deviceExpires);
  }

  resetAuthUser(userId: number): void {
    this.authUserMap.resetAuthUser(userId);
  }

  /**
   * Verifies and builds the auth user. First it is extract the auth user from the token and then verified the
   * last access of the user device.
   *
   * @param {DbConnection} conn the connection
   * @param {string} token the http header token.
   * @returns {Promise<AuthUser>} the auth user
   * @throws AuthError
   */
  async verifyAndBuildAuthUser(conn: DbConnection, token: string): Promise<AuthUser> {

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
    const status = await this.authUserMap.checkDevice(authUser.id, authUser.device, this.loaderDevice(conn));
    if (status !== AuthUserDeviceStatus.Okay) {
      console.warn('> Warn: User %s (d=%s) Status =>', authUser.id, authUser.device, status);
      throw new AuthError(status as string, 'Unauthorized access');
    }

    return authUser;
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {name: 'AuthUserService.saveLastAccess'})
  async saveDeviceLastAccess(): Promise<void> {
    const conn = this.dbService.getConnection();
    console.debug('> Debug: [%s] Start to save from device list', DateUtil.formatTimestamp());

    const deviceList = this.authUserMap.getUpdatingDeviceList();
    if (deviceList.length === 0) {
      console.debug('> Debug: Nothing to save from the device list');
    }

    try {

      await conn.startTransaction();

      await asyncForEach(deviceList, async (value: IDeviceUpdate) => {

        const updateValues = {
          deviceId: value.deviceId,
          lastAccess: DateUtil.formatTimestamp(value.lastAccess)
        };
        let no: number = -1;

        switch (value.state) {
          case 'modified':
            console.debug('> Debug: Update device %s => %s', updateValues.deviceId, updateValues.lastAccess);
            no = await conn.update(SQL_UPDATE_DEVICE, updateValues);
            console.log('> Trace: Changed %s rows', no);
            break;
          case 'deleting':
            console.debug('> Debug: Delete device %s', updateValues.deviceId);
            no = await conn.delete(SQL_DELETE_DEVICE, updateValues);
            console.log('> Trace: Affected %s rows', no);
            break;
          default:
            console.warn('> Warn: device state "%s" is not handle (user %s, device %s => %s)',
              value.state, value.userId, value.deviceId, DateUtil.formatTimestamp(value.lastAccess)
            );
            break;
        }
      });

      await conn.commit();

    } catch (e) {
      await conn.rollback();
      console.error('> Error: Has occurred by save last of user devices (message=%s)', e.message);
    } finally {
      conn.release();
      console.debug('> Debug: [%s] Finish to save the lastAccess', DateUtil.formatTimestamp());
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {name: 'AuthUserService.deleteExpiredDevices'})
  async deleteExpiredDevices(): Promise<void> {

    const expiresDate = this.authUserMap.getExpiresDate();
    console.debug('> Debug: [%s] Start delete expired devices', DateUtil.formatTimestamp());

    const conn = this.dbService.getConnection();
    try {

      await conn.startTransaction();

      const deleteValues = {
        expiresDate: DateUtil.formatTimestamp(expiresDate)
      };
      const affectedRows = await conn.delete(SQL_DELETE_EXPIRED_DEVICES, deleteValues);

      await conn.commit();

      console.info('> Info: Delete expired devices %s rows', affectedRows);
    } catch (e) {
      await conn.rollback();
      console.error('> Error: Expired devices failed to delete (%s)', e.message);
    } finally {
      conn.release();
      console.debug('> Debug: [%s] Finish to delete expired devices', DateUtil.formatTimestamp());
    }
  }

  private loaderDevice(conn: DbConnection): LoaderDeviceFunc {
    return async (userId: number): Promise<IDeviceItem[]> => {
      return conn.select<IDeviceItem>(SQL_SELECT_USER_DEVICE_LIST, {userId});
    };
  }
}
