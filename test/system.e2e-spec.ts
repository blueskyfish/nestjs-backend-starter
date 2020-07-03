import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { About } from '../src/business/system/entity';
import { DbService } from '../src/common/database';
import { TestModule } from './test.module';

describe('SystemController (e2e)', () => {
  let app: INestApplication = null;
  let dbService: DbService = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbService = app.get(DbService);
  });

  afterAll(async () => {
    await dbService.release();
    await app.close()
  });

  it('/ (GET)', async () => {
    const helloRes = await request(app.getHttpServer())
      .get('/?name=Susi')
      .accept('text/plain')
      .expect(200);
    expect(helloRes.text).not.toBeNull();
    expect(helloRes.text).toEqual('Hello Susi!')
  });

  it('/alive (GET)', async () => {
    const aliveRes = await request(app.getHttpServer())
      .get('/alive')
      .expect(200);
    expect(aliveRes.body).not.toBeNull();
    expect(typeof aliveRes.body.start).toEqual('string');
    expect(typeof aliveRes.body.duration).toEqual('string');
  });

  it('/about (GET)', async () => {
    const aboutRes = await request(app.getHttpServer())
      .get('/about')
      .expect(200);
    expect(aboutRes.body).not.toBeNull();

    const about: About = aboutRes.body;
    expect(typeof about.name).toEqual('string');
  });
});
