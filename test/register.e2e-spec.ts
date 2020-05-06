import { INestApplication } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_DB_HOST } from '../src/app.config';
import { AppAuthModule } from '../src/auth/auth.module';
import { AppBusinessModule } from '../src/business/business.module';
import { RegisterPayload } from '../src/business/entities';
import { UserService } from '../src/business/user';
import { AppCommonModule } from '../src/common/common.module';
import { DbService } from '../src/common/database';
import { SecondUtil } from '../src/common/util';

jest.setTimeout(120000);

describe('Register User', () => {

  let app: INestApplication = null;
  let dbService: DbService = null;
  let userService: UserService = null;

  beforeEach(async () => {

    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        ScheduleModule.forRoot(),

        AppCommonModule.forRoot({
          host: DEFAULT_DB_HOST,
          port: 17306,
          user: 'starter',
          database: 'starter-test',
          password: 'Starter1234',
          connectLimit: 20, // TODO Environment variable
        }),
        AppAuthModule.forRoot({
          priKeyFilename: './test-private.pem',
          pubKeyFilename: './test-public.pem',
        }),
        AppBusinessModule.forRoot({
          deviceExpires: SecondUtil.fromMinutes( 2),
        }),
      ]
    })
      .compile();

    app = testModule.createNestApplication();
    await app.init();

    dbService = app.get(DbService);
    const conn = dbService.getConnection();

    let result = await conn.query('TRUNCATE TABLE `starter_users`')
    console.debug('> Debug: truncate "users" =>', result);
    result = await conn.query('TRUNCATE TABLE `starter_devices`');
    console.debug('> Debug: truncate "devices" =>', result);

    userService = app.get(UserService);
  });

  it('Register new User', async () => {
    const payload: RegisterPayload = {
      name: 'Test',
      email: 'test@text.de',
      password: 'test1234',
      repeat: 'test1234',
      roles: ['reader', 'admin']
    }

    const conn = dbService.getConnection();
    try {
      const loginUser = await userService.register(conn, payload);
      expect(loginUser).not.toBeNull();
      expect(loginUser.name).toBe('Test');
      expect(loginUser.token).not.toBeNull();
    } finally {
      conn.release();
    }


  })
});
