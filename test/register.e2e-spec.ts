import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Response } from 'supertest';
import { HTTP_AUTH_HEADER } from '../src/auth';
import { RegisterPayload } from '../src/business/entities';
import { DbService } from '../src/common/database';
import { TestModule } from './test.module';

jest.setTimeout(120000);

describe('RegisterController (e2e)', () => {

  let app: INestApplication = null;

  beforeAll(async () => {

    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule,
      ]
    }).compile();

    app = testModule.createNestApplication();
    await app.init();

    const dbService = app.get(DbService);
    const conn = dbService.getConnection();

    let result = await conn.query('TRUNCATE TABLE `starter_users`');
    console.debug('> Debug: truncate "users" =>', result);
    result = await conn.query('TRUNCATE TABLE `starter_devices`');
    console.debug('> Debug: truncate "devices" =>', result);
  });

  it('/register (POST)', async () => {

    const payload: RegisterPayload = {
      name: 'Test',
      email: 'test@text.de',
      password: 'test1234',
      repeat: 'test1234',
      roles: [ 'reader', 'admin' ]
    };

    const registerRes = await request(app.getHttpServer())
      .post('/register')
      .send(payload)
      .expect(201);

    expect(registerRes.body).not.toBeNull();

    const token = registerRes.body.token;
    expect(token).not.toBeNull();

    const userInfoRes = await request(app.getHttpServer())
      .get('/user/info')
      .set({
        [HTTP_AUTH_HEADER]: token,
      })
      .expect(200);

    expect(userInfoRes.body).not.toBeNull();

    expect(userInfoRes.body.name).toEqual(registerRes.body.name);
  });
});
