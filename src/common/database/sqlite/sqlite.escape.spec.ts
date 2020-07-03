import { NULL_VALUE } from '../db.config';
import { SqliteEscape } from './sqlite.escape';

describe('Sqlite Escape', () => {

  it('Escape Statement: simple', () => {

    const sql = SqliteEscape.escapeQuery('SELECT * from `test` WHERE user_id = {userId}', {
      userId: 4711,
    });

    expect('SELECT * from `test` WHERE user_id = 4711').toEqual(sql);
  });

  it('Escape Statement: string', () => {
    const sql = SqliteEscape.escapeQuery('SELECT * from `test` WHERE user_id = {userId}', {
      userId: '4711',
    });

    expect('SELECT * from `test` WHERE user_id = \'4711\'').toEqual(sql);
  });

  it('Escape Statement: objects', () => {
    const sql = SqliteEscape.escapeQuery(
      'INSERT INTO `test` (name, email, age, city) VALUES({name}, {email}, {age}, {city})',
      {
        name: 'Maria',
        email: 'maria@test.de',
        age: 47,
        city: null,
      });
    expect('INSERT INTO `test` (name, email, age, city) VALUES(\'Maria\', \'maria@test.de\', 47, NULL)').toEqual(sql);
  });

  it('Escape string', () => {
    const text = SqliteEscape.escapeString('Test\'s Many');
    expect(text).toEqual('\'Test\'\'s Many\'');
  });

  it('Escape date time', () => {
    const date = new Date(2020, 5, 12, 13, 43, 34);
    const text = SqliteEscape.escapeDate(date);
    expect(text).toEqual('\'2020-06-12 13:43:34\'');
  });

  it('Escape date', () => {
    const date = new Date(2020, 5, 12);
    const text = SqliteEscape.escapeDate(date);
    expect(text).toEqual('\'2020-06-12 00:00:00\'');
  });

  it('Escape Array', () => {
    const sql = [
      'SELECT * FROM `test`', '\n',
      'WHERE user IN {names}',
    ].join('');

    const values = {
      names: ['Susi', 'Berti']
    };

    const text = SqliteEscape.escapeQuery(sql, values);

    expect(text.includes('WHERE user IN \'Susi\',\'Berti\'')).toBeTruthy();
  });

  it('Nothing to escaping', () => {
    const sql = 'SELECT user FROM `users`'
    const text1 = SqliteEscape.escapeQuery(sql, null);
    expect(text1).toEqual(sql);
    const text2 = SqliteEscape.escapeQuery(sql, {});
    expect(text2).toEqual(sql);
  });

  it('Escape only existing parameters', () => {
    const sql = 'SELECT user FROM `users` WHERE user_id = {userId} AND enabled = {enabled}';
    const text = SqliteEscape.escapeQuery(sql, { userId: 4711});
    expect(text).toEqual('SELECT user FROM `users` WHERE user_id = 4711 AND enabled = {enabled}')
  });

  it('Escape boolean', () => {
    expect(SqliteEscape.escape(true)).toEqual('true');
    expect(SqliteEscape.escape(false)).toEqual('false');
  });

  it('Escape number', () => {
    expect(SqliteEscape.escape(4711)).toEqual('4711');
  });

  it('Escape Buffer', () => {
    const buffer = Buffer.from('ABC', 'utf8');
    const text = SqliteEscape.escape(buffer);
    expect(text).toEqual('X\'414243\'');
  });

  it('Escape null', () => {
    expect(SqliteEscape.escape(null)).toEqual(NULL_VALUE);
  });

  it('Escape Json', () => {
    const value = { id: 4711, name: 'Susi'};
    expect(SqliteEscape.escape(value)).toEqual('\'{"id":4711,"name":"Susi"}\'');
  })
});
