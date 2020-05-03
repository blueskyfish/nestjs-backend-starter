/**
 * Insert (register) a new device from the given user.
 */
export interface IDbInsertDevice {
  userId: number;
  name: string;
  time: string;
}
