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
    expect(DbUtil.getValue(6, value, 5)).toBe(6);
  });

})
