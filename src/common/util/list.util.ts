
export type DataFunc<T> = (data: T) => void;

export type MapFunc<T, R> = (data: T) => R;

export const asyncForEach = async <T>(list: T[], callback: DataFunc<T>): Promise<void> => {
  for (let index = 0; index < list.length; index++) {
    await callback(list[index]);
  }
};

export const forEachIterator = <T>(it: IterableIterator<T>, callback: DataFunc<T>) => {
  for (const value of it) {
    callback(value);
  }
};

export const asyncForEachIterator = async <T>(it: IterableIterator<T>, callback: DataFunc<T>): Promise<void> => {
  for (const value of it) {
    await callback(value);
  }
};

export const mapIterator = <T, R>(it: IterableIterator<T>, callback: MapFunc<T, R>): R[] => {
  const list: R[] = [];
  for (const value of it) {
    list.push(callback(value));
  }
  return list;
};
