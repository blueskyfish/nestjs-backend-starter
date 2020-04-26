import { ValidUtil } from './valid.util';

describe('Valid.Util', () => {

  it('Is Null', () => {
    expect(ValidUtil.notNum(null)).toBeTruthy();
  });

  it('Is NaN', () => {
    expect(ValidUtil.notNum(NaN)).toBeTruthy();
  });

  it('Is A String', () => {
    expect(ValidUtil.notNum('set')).toBeTruthy();
  });

  it('Is A string with number', () => {
    expect(ValidUtil.notNum('12test')).toBeTruthy();
  });

  it('Is a number string', () => {
    expect(ValidUtil.notNum('23')).toBeTruthy();
  });


  it('Is positive number', () => {
    expect(ValidUtil.notNum(12)).toBeFalsy();
  });

  it('Is negative number', () => {
    expect(ValidUtil.notNum(-12)).toBeFalsy();
  });

  it('Is zero number', () => {
    expect(ValidUtil.notNum(0)).toBeFalsy();
  })

  describe('Is positive number', () => {
    expect(ValidUtil.isPositiv(12)).toBeTruthy();
  });

  describe('Is zero number', () => {
    expect(ValidUtil.isPositiv(0)).toBeFalsy();
  });

  describe('Is negative number', () => {
    expect(ValidUtil.isPositiv(-12)).toBeFalsy();
  });

  describe('Is NaN number', () => {
    expect(ValidUtil.isPositiv(NaN)).toBeFalsy();
  })
})
