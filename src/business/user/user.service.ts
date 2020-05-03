import { Injectable } from '@nestjs/common';
import { AuthUser } from '../../auth';
import { PasswordService } from '../../auth/password';
import { TokenService } from '../../auth/token';
import { DbConnection } from '../../common/database';
import { DateUtil } from '../../common/util';
import { LoginPayload, LoginUser, RegisterPayload, UserInfo } from '../entities';
import { mailAlreadyUse, notFoundUser, registerUserFailed, UserError } from '../errors';
import { AuthUserService } from '../middleware';
import { openRepository, RepositoryProvider } from '../repository';
import { IDbInsertDevice } from '../repository/device/entities';
import { IDbInsertUser } from '../repository/user/entities';
import { NameGeneratorService } from '../service';

@Injectable()
export class UserService {

  constructor(
    private tokenService: TokenService,
    private passwordService: PasswordService,
    private nameGenerator: NameGeneratorService,
    private authUserService: AuthUserService
  ) {
  }

  /**
   * Login the user with his credentials `email` and `password`.
   *
   * @param {DbConnection} conn the database connection
   * @param {LoginPayload} payload the payload data from sent user
   * @returns {Promise<LoginUser>} in case of success it sends back the user information with authentication.
   * @throws UserError
   */
  async login(conn: DbConnection, payload: LoginPayload): Promise<LoginUser> {
    return await openRepository<LoginUser>(conn)
      .execute(async (rep: RepositoryProvider) => {

        const dbUser = await rep.user.findUserByEmail(payload.email);
        if (!dbUser) {
          throw notFoundUser();
        }

        const checked = this.passwordService.checkPassword(dbUser.password, payload.password);
        if (!checked) {
          throw notFoundUser();
        }

        try {
          await rep.startTransaction();

          const deviceValues: IDbInsertDevice = {
            name: this.nameGenerator.generatorName(),
            time: DateUtil.formatTimestamp(),
            userId: dbUser.userId
          };
          const deviceId = await rep.device.insertDevice(deviceValues);

          await rep.commit();

          const roles: string[] = JSON.parse(dbUser.roles);
          const token = this.tokenService.from(dbUser.userId, deviceId, roles);

          this.authUserService.resetAuthUser(dbUser.userId);

          // the login user
          return {
            id: dbUser.userId,
            name: dbUser.name,
            email: dbUser.email,
            token,
          } as LoginUser;

        } catch (e) {
          console.error('> Error: User Login =>', e.message);
          await rep.rollback();
          throw notFoundUser();
        }

      });
  }

  async getInfo(conn: DbConnection, authUser: AuthUser): Promise<UserInfo> {
    return await openRepository<UserInfo>(conn)
      .execute(async (rep: RepositoryProvider) => {
        const dbUser = await rep.user.findUserById(authUser.id);

        return {
          id: dbUser.userId,
          name: dbUser.name,
          email: dbUser.email,
        } as UserInfo;
      });
  }

  /**
   * Register a new user with his credentials.
   *
   * @param {DbConnection} conn the database connection
   * @param {RegisterPayload} payload the payload data sent from user
   * @returns {Promise<LoginUser>} in case of success it sends back the user information with authentication.
   * @throws UserError
   */
  async register(conn: DbConnection, payload: RegisterPayload): Promise<LoginUser> {
    return openRepository<LoginUser>(conn)
      .execute(async (rep: RepositoryProvider) => {

        const exist = await rep.user.emailExists(payload.email);
        if (exist) {
          throw mailAlreadyUse();
        }

        try {
          await rep.startTransaction();

          const values: IDbInsertUser = {
            name: payload.name,
            email: payload.email,
            roles: JSON.stringify(payload.roles),
            password: this.passwordService.generatePassword(payload.password),
          };
          const dbUserId = await rep.user.insertUser(values);

          const deviceValues: IDbInsertDevice = {
            name: this.nameGenerator.generatorName(),
            time: DateUtil.formatTimestamp(),
            userId: dbUserId,
          };
          const deviceId = await rep.device.insertDevice(deviceValues);

          await rep.commit();

          // build the response
          const dbUser = await rep.user.findUserById(dbUserId);
          const roles: string[] = JSON.parse(dbUser.roles);
          const token = this.tokenService.from(dbUserId, deviceId, roles);

          // the login user
          return {
            id: dbUser.userId,
            name: dbUser.name,
            email: dbUser.email,
            token,
          } as LoginUser;

        } catch (e) {
          await rep.rollback();
          throw registerUserFailed();
        }
      });
  }
}
