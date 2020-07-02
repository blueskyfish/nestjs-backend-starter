import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestingLogger } from '@nestjs/testing/services/testing-logger.service';
import * as path from 'path';
import { SqliteConfig } from './sqlite.config';
import { SqliteService } from './sqlite.service';

interface IDbUser {
  name: string;
  email: string,
  password: string;
  roles: string;
}

describe('Sqlite Service', () => {

  let sqliteService: SqliteService = null;

  beforeAll(async () => {

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        {
          provide: SqliteConfig,
          useValue: new SqliteConfig({
            type: 'sqlite',
            filename: path.join(process.cwd(), 'test', 'starter.db'),
          }),
        },
        SqliteService,
      ]
    }).compile();

    app.useLogger(TestingLogger);

    sqliteService = app.get(SqliteService);
  });

  describe('Use Sqlite Service', () => {

    it('Find user "Susi" by Email', async () => {
      const findSQL = 'SELECT name, email, password, roles FROM `starter_users` WHERE email = {email}';
      const conn = sqliteService.getConnection();
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

      const conn = sqliteService.getConnection();
      const userId = await conn.insert(insertSql, values);
      expect(isNaN(userId)).not.toBeTruthy();

      const affectedRows = await conn.delete('DELETE FROM `starter_users` WHERE user_id = {userId}', {
        userId,
      });
      expect(affectedRows).toEqual(1);
    });
  });
});
