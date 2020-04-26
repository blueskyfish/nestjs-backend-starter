import { ENCODE_UTF, readFileAsync } from './fs-async';

/**
 * Read the key from the file.
 *
 * **Format**
 *
 * ```txt
 * -----BEGIN PUBLIC KEY-----
 * MIIBIe5TNT
 * ...
 * YwIDAQABmR
 * -----END PUBLIC KEY-----
 * ```
 *
 * @param {string} filename
 * @returns {Promise<string>}
 */
export const readKey = async (filename: string): Promise<string> => {

  const content = await readFileAsync(filename, ENCODE_UTF);

  return content
    .replace('\r', '')
    .trim();
}
