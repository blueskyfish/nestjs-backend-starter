import { buildPassword, getPassword, getSalt, getVersion } from './password.util';

describe('Password Util', () => {

  const hashedPassword = buildPassword('ABC_XYZ', 'SaltedStars1234%');

  it('should return password version "v1"', () => {
    expect(getVersion(hashedPassword)).toBe('v1');
  });

  it('should return the salt part', () =>{
    expect(getSalt(hashedPassword)).toBe('ABC_XYZ');
  });

  it('should return the password part', () => {
    expect(getPassword(hashedPassword)).toBe('SaltedStars1234%');
  });

  it('should return "null" 1', () => {
    expect(getVersion(null)).toBeNull();
  });

  it('should return "null" 2', () => {
    expect(getSalt(hashedPassword.substring(3))).toBeNull();
  });

  it('should return "null" 3', () => {
    expect(getPassword('<::>')).toBeNull();
  })
});
