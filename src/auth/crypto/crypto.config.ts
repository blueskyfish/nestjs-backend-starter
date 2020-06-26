
export interface ICryptoConfig {

  /**
   * The filename of the private key content
   */
  readonly priKeyFilename;

  /**
   * The filename of the public key content
   */
  readonly pubKeyFilename;
}

/**
 * A container with the public- and private key and the password salt
 */
export class CryptoConfig {

  constructor(public readonly publicKey: string, public readonly privateKey, public readonly passwordSalt) {}
}
