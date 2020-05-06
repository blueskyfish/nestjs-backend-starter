import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppModule } from '../src/app.module';
import { AuthMiddleware } from '../src/business/middleware';
import { TestModule } from './test.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/?name=Susi')
      .expect(200)
      .expect('Hello Susi!');
  });
});
