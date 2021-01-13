import { DateUtil } from './date.util';

describe('DateUtil', () => {

  const date = '2018-12-24';

  it ('Parse string to DateTime', () => {
    const d = DateUtil.fromDate(date);
    expect(d).not.toBeNull();
    expect(d.year).toBe(2018);
    expect(d.month).toBe(12);
    expect(d.day).toBe(24);
  });

  it('Format Date + 2 Hours', () => {
    const d = DateUtil.fromDate(date);
    const dt = d.plus({hours: 2, minutes: 15});
    const text = DateUtil.formatDateTime(dt);
    expect(text).toBe('2018-12-24 02:15');
  });

})
