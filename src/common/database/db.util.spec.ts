import { DbUtil } from './db.util';

describe('DbUtil', () => {

  it('should return the value', () => {
    expect(DbUtil.getValue(6, 10, 5)).toBe(10);
  });

  it('should return the min value', () => {
    expect(DbUtil.getValue(6, 3, 5)).toBe(5);
  });

  it('should return the default value', () => {
    const value: number = null;
    const def = 6;
    expect(DbUtil.getValue(def, value, 5)).toBe(def);
  });

  it('should return the "boolean" default value', () => {
    const value = null;
    const def = true;
    expect(DbUtil.getValue(def, value)).toBeTruthy();
  });

  it('should return the "boolean" value and not the default', () => {
    const value = true;
    const def = false;
    expect(DbUtil.getValue(def, value)).toBeTruthy();
  });
})
