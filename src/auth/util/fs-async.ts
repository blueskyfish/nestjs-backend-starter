
import * as fs from 'fs';
import { promisify } from 'util';

export const ENCODE_UTF = 'utf8';
export const ENCODE_HEX = 'hex';
export const HASH_FUNC = 'sha256';

export const readFileAsync = promisify(fs.readFile);
export const statAsync = promisify(fs.stat);
export const existsAsync = promisify(fs.exists);
