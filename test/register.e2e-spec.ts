import { INestApplication } from '@nestjs/common';
import * as _ from 'lodash';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HTTP_AUTH_HEADER } from '../src/auth';
import { RegisterPayload } from '../src/business/user/entities';
import { DbService } from '../src/common/database';
import { NL, RepositoryNames } from '../src/repository/pool/repository.names';
import { TestModule } from './test.module';

const SQL_DELETE_USER = [
  'DELETE FROM ', RepositoryNames.Users, NL,
  'WHERE user_id = {userId}'
].join('');

const SQL_FIND_USER = [
  'SELECT user_id AS userId', NL,
  'FROM ', RepositoryNames.Users,
  'WHERE `email` = {email}'
].join('');

describe('Register User', () => {

  let app: INestApplication = null;
  let dbService: DbService = null;
  let userId: number = null;

  beforeAll(async () => {

    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule,
      ]
    }).compile();

    app = testModule.createNestApplication();
    await app.init();

    dbService = app.get(DbService);
    const conn = dbService.getConnection();
    try {
      const userId = await conn.selectOne<{userId: number}>(SQL_FIND_USER, { email: 'test@test.de'});
      if (!_.isNil(userId)) {
        await conn.delete(SQL_DELETE_USER, {userId});
      }
    } finally {
      conn.release();
    }
  });

  afterAll(async () => {

    if (!_.isNil(userId)) {
      const conn = dbService.getConnection();
      try {
        await conn.delete(SQL_DELETE_USER, {userId});
      } finally {
        conn.release();
      }
    }

    await dbService.release();
    await app.close();
  });

  it('', async () => {

    const payload: RegisterPayload = {
      name: 'Test',
      email: 'test@test.de',
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

    userId = userInfoRes.body.id;
  });
});
