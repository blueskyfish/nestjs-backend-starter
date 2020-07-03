import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestingLogger } from '@nestjs/testing/services/testing-logger.service';
import * as path from 'path';
import { DbService } from '../db.service';
import { SqliteConfig } from './sqlite.config';
import { SqliteService } from './sqlite.service';

interface IDbUser {
  name: string;
  email: string,
  password: string;
  roles: string;
}

describe('Sqlite Service', () => {

  let app: TestingModule = null;
  let dbService: DbService = null;

  beforeAll(async () => {

    app = await Test.createTestingModule({
      providers: [
        Logger,
        {
          provide: DbService,
          inject: [Logger],
          useFactory: (logger: Logger) => {
            return new DbService(new SqliteService(logger, new SqliteConfig({
              type: 'sqlite',
              filename: path.join(process.cwd(), 'test', 'starter.db')
            })))
          }
        }
      ]
    }).compile();

    app.useLogger(TestingLogger);

    await app.init();

    dbService = app.get(DbService);
  });

  afterAll(async () => {
    await dbService.release();
    await app.close()
  });

  describe('Use Sqlite Service', () => {

    it('Find user "Susi" by Email', async () => {
      const findSQL = 'SELECT name, email, password, roles FROM `starter_users` WHERE email = {email}';
      const conn = dbService.getConnection();
      const dbUser = await conn.selectOne<IDbUser>(findSQL, { email: 'susi@test.de'});
      expect(dbUser).not.toBeNull();
      expect(dbUser.name).toEqual('Susi');
    });

    it('Insert User and delete', async () => {
      const insertSql = 'INSERT INTO `starter_users` (name, email, password, roles) VALUES({name}, {email}, {password}, {roles})';
      const id = Date.now();
      const values = {
        name: `Test-${id}`,
        email: `test.${id}@test.de`,
        password: '-test1234',
        roles: JSON.stringify(['writer', 'backup'])
      };

      const conn = dbService.getConnection();
      const userId = await conn.insert(insertSql, values);
      expect(isNaN(userId)).not.toBeTruthy();

      const affectedRows = await conn.delete('DELETE FROM `starter_users` WHERE user_id = {userId}', {
        userId,
      });
      expect(affectedRows).toEqual(1);
    });
  });
});
