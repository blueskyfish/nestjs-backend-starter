import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HTTP_AUTH_HEADER } from '../src/auth';
import { LoginPayload, LoginUser, UserInfo } from '../src/business/user/entities';
import { DbService } from '../src/common/database';
import { TestModule } from './test.module';

describe('User Login', () => {

  let app: INestApplication = null;
  let dbService: DbService = null;

  beforeAll(async () => {

    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule,
      ]
    }).compile();

    app = testModule.createNestApplication();
    await app.init();

    dbService = app.get(DbService);
  });

  afterAll(async () => {
    await dbService.release();
    await app.close()
  });

  it('User Login and get Info', async () => {
    const data: LoginPayload = {
      email: 'susi@test.de',
      password: 'test1234'
    };
    const loginRes = await request(app.getHttpServer())
      .put('/login')
      .send(data)
      .expect(200);

    expect(loginRes.body).not.toBeNull();

    const login: LoginUser = loginRes.body;

    const token = login.token;
    expect(token).not.toBeNull();

    const infoRes = await request(app.getHttpServer())
      .get('/user/info')
      .set({
        [HTTP_AUTH_HEADER]: token,
      })
      .expect(200);
    expect(infoRes.body).not.toBeNull();

    const info: UserInfo = infoRes.body;
    expect(info.id).toEqual(login.id);
    expect(info.email).toEqual(login.email);
    expect(info.name).toEqual(login.name);
  });

});
