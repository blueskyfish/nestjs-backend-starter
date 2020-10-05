import { LoUtil } from './lo.util';

describe('LoUtil', () => {

  describe('isNil', () => {

    it('should return "true"', () => {
      const dd = null;
      const rec: any = {};
      expect(LoUtil.isNil(dd)).toBeTruthy();
      expect(LoUtil.isNil(rec.date)).toBeTruthy();
    });

    it('should return "false"', () => {
      expect(LoUtil.isNil(1)).toBeFalsy();
      expect(LoUtil.isNil(true)).toBeFalsy();
      expect(LoUtil.isNil('test')).toBeFalsy();
    });

    it('"NaN" should return "false"', () => {
      expect(LoUtil.isNil(NaN)).toBeFalsy();
    });

  });

  describe('isString', () => {

    it('empty string should return "true"', () => {
      expect(LoUtil.isString('')).toBeTruthy();
    });

    it('should be a string', () => {
      const text = 'ABC';
      expect(LoUtil.isString(text)).toBeTruthy();
      expect(LoUtil.isString(3.14567.toFixed(2))).toBeTruthy();
    });

    it('should not be a string', () => {
      let ss;
      expect(LoUtil.isString(null)).toBeFalsy();
      expect(LoUtil.isString(ss)).toBeFalsy();
      expect(LoUtil.isString(1)).toBeFalsy();
      expect(LoUtil.isString(new Date())).toBeFalsy();
      expect(LoUtil.isString(NaN)).toBeFalsy();
    });
  });

  describe('isFunction', () => {

    it('should not a function', () => {
      expect(LoUtil.isFunction(1)).toBeFalsy();
      expect(LoUtil.isFunction('today')).toBeFalsy();
      expect(LoUtil.isFunction(null)).toBeFalsy();
      expect(LoUtil.isFunction(undefined)).toBeFalsy();
    });

    it('should a function', () => {
      function hello(hello: string) {
        console.log(hello);
      }
      const calc = (x: number, y: number): number => x +y;

      expect(LoUtil.isFunction(hello)).toBeTruthy();
      expect(LoUtil.isFunction(calc)).toBeTruthy();
    });
  });

  describe('toLower', () => {

    it('should convert to lowercase', () => {
      expect(LoUtil.toLower('Abc')).toEqual('abc');
      expect(LoUtil.toLower('abc')).toEqual('abc');
      expect(LoUtil.toLower('ABC')).toEqual('abc');
    });

    it('empty string is null', () => {
      expect(LoUtil.toLower('')).toBeNull();
    });

    it('Null or undefined should return null', () => {
      expect(LoUtil.toLower(null)).toBeNull();
      expect(LoUtil.toLower(undefined)).toBeNull();
    });

  });


  describe('toUpper', () => {

    it('should convert to lowercase', () => {
      expect(LoUtil.toUpper('Abc')).toEqual('ABC');
      expect(LoUtil.toUpper('abc')).toEqual('ABC');
      expect(LoUtil.toUpper('ABC')).toEqual('ABC');
    });

    it('empty string is null', () => {
      expect(LoUtil.toUpper('')).toBeNull();
    });

    it('Null or undefined should return null', () => {
      expect(LoUtil.toUpper(null)).toBeNull();
      expect(LoUtil.toUpper(undefined)).toBeNull();
    });

  });

  describe('trim', () => {

    it('should trim string', () => {
      expect(LoUtil.trim('  ABC  ')).toEqual('ABC');
    });

    it ('Empty string return null', () => {
      expect(LoUtil.trim('')).toBeNull();
    });

    it('Null or undefined return null', () => {
      expect(LoUtil.trim(null)).toBeNull();
      expect(LoUtil.trim(undefined)).toBeNull();
    });
  });

  describe('startsWith', () => {

    it('should return true', () => {
      expect(LoUtil.startsWith('test1234', 'test')).toBeTruthy();
      expect(LoUtil.startsWith('test1234', 'est', 1)).toBeTruthy();
    });

    it('should return false', () => {
      expect(LoUtil.startsWith(null, 'test')).toBeFalsy();
      expect(LoUtil.startsWith(null, null)).toBeFalsy();
      expect(LoUtil.startsWith('test1234', null)).toBeFalsy();
    });

  });

  describe('endsWith', () => {

    it('should return true', () => {
      expect(LoUtil.endsWidth('test1234', '1234')).toBeTruthy();
      expect(LoUtil.endsWidth('test1234', '123', 'test1234'.length - 1)).toBeTruthy();
    });

    it('should return false', () => {
      expect(LoUtil.endsWidth(null, 'test')).toBeFalsy();
      expect(LoUtil.endsWidth(null, null)).toBeFalsy();
      expect(LoUtil.endsWidth('test1234', null)).toBeFalsy();
    });

  });

  describe('get', () => {
    const d = {
      list: [
        'ab', 'cd'
      ],
      flag: true,
      some: {
        age: 12,
        name: 'Sam'
      },
    };

    it('get from list', () => {
      expect(LoUtil.get(d, 'list[0]', null)).toEqual('ab');
      expect(LoUtil.get(d, 'list[1]', null)).toEqual('cd');
      expect(LoUtil.get(d, 'list[99]', null)).toBeNull();
    });

    it('get value', () => {
      expect(LoUtil.get(d, 'flag', false)).toEqual(true);
    });

    it('get sub value', () => {
      expect(LoUtil.get(d, 'some.name', null)).toEqual('Sam');
      expect(LoUtil.get(d, 'some.age', NaN)).toEqual(12);
    });
  });

  describe('size', () => {

    it('string returns length', () => {
      expect(LoUtil.size('abc')).toEqual(3);
      expect(LoUtil.size('Abc' + 'Xyz')).toEqual(6);
      expect(LoUtil.size('')).toEqual(0);
    });

    it('Object returns property count', () => {
      const d1 = {
        f1: 'Hallo',
        f2: 23,
        f3: true,
        f4: null,
      };
      expect(LoUtil.size(d1)).toEqual(4);
    });

    it('Array returns the count of items', () => {
      expect(LoUtil.size(['a', 'b'])).toEqual(2);
      expect(LoUtil.size([12, 23, null, null, 33])).toEqual(5);
    });

    it('Other values are -1', () => {
      expect(LoUtil.size(null)).toEqual(-1);
      expect(LoUtil.size(undefined)).toEqual(-1);
    })
  });

});
