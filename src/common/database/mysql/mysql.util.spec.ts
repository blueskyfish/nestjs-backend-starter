import { MysqlUtil } from './mysql.util';

describe('Mysql Util', () => {

  it('should return the value', () => {
    expect(MysqlUtil.getValue(6, 10, 5)).toBe(10);
  });

  it('should return the min value', () => {
    expect(MysqlUtil.getValue(6, 3, 5)).toBe(5);
  });

  it('should return the default value', () => {
    const value: number = null;
    const def = 6;
    expect(MysqlUtil.getValue(def, value, 5)).toBe(def);
  });

  it('should return the "boolean" default value', () => {
    const value = null;
    const def = true;
    expect(MysqlUtil.getValue(def, value)).toBeTruthy();
  });

  it('should return the "boolean" value and not the default', () => {
    const value = true;
    const def = false;
    expect(MysqlUtil.getValue(def, value)).toBeTruthy();
  });
})
