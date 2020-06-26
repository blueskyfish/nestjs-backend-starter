import { Injectable } from '@nestjs/common';
import { PasswordService } from '../../auth/password';
import { TokenService } from '../../auth/token';
import { AuthUser } from '../../auth/user';
import { RepositoryPool } from '../../repository/pool';
import { IDbInsertUser } from '../../repository/pool/user/entities';
import { RepositoryService } from '../../repository';
import { LoginPayload, LoginUser, RegisterPayload, UserInfo } from './entities';
import { UserError } from './user.error';

/**
 * The service handle the user request
 */
@Injectable()
export class UserService {

  constructor(
    private repositoryService: RepositoryService,
    private tokenService: TokenService,
    private passwordService: PasswordService
  ) {
  }

  /**
   * Login the user with his credentials `email` and `password`.
   *
   * @param {LoginPayload} payload the payload data from sent user
   * @returns {Promise<LoginUser>} in case of success it sends back the user information with authentication.
   * @throws UserError if the user not found
   */
  async login(payload: LoginPayload): Promise<LoginUser> {
    return await this.repositoryService.execute<LoginUser>(async (rep: RepositoryPool) => {

      const dbUser = await rep.user.findUserByEmail(payload.email);
      if (!dbUser) {
        throw UserError.notFound();
      }

      const checked = this.passwordService.checkPassword(dbUser.password, payload.password);
      if (!checked) {
        throw UserError.notFound();
      }

      const roles: string[] = JSON.parse(dbUser.roles);
      const token = this.tokenService.fromAuth({
        id: dbUser.userId,
        roles,
        // TODO Add here additional values
      });

      // the login user
      return {
        id: dbUser.userId,
        name: dbUser.name,
        email: dbUser.email,
        token,
      } as LoginUser;

    });
  }

  /**
   * Get the information from the current user
   *
   * @param {AuthUser} authUser the current user.
   * @returns {Promise<UserInfo>}
   * @throws UserError if the user is not found
   */
  async getInfo(authUser: AuthUser): Promise<UserInfo> {
    return await this.repositoryService.execute<UserInfo>(async (rep: RepositoryPool) => {

      const dbUser = await rep.user.findUserById(authUser.id);
      if (!dbUser) {
        throw UserError.notFound();
      }

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
   * @param {RegisterPayload} payload the payload data sent from user
   * @returns {Promise<LoginUser>} in case of success it sends back the user information with authentication.
   * @throws UserError if the email is already use or intern database error
   */
  async register(payload: RegisterPayload): Promise<LoginUser> {

    return this.repositoryService.execute<LoginUser>(async (rep: RepositoryPool) => {

      const exist = await rep.user.emailExists(payload.email);
      if (exist) {
        throw UserError.mailAlreadyUse();
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

        await rep.commit();

        // build the response
        const dbUser = await rep.user.findUserById(dbUserId);
        const roles: string[] = JSON.parse(dbUser.roles);
        const token = this.tokenService.fromAuth({
          id: dbUser.userId,
          roles,
          // TODO Add here additional values
        });

        // the login user
        return {
          id: dbUser.userId,
          name: dbUser.name,
          email: dbUser.email,
          token,
        } as LoginUser;

      } catch (e) {
        await rep.rollback();
        throw UserError.registerFailed();
      }
    });
  }
}
