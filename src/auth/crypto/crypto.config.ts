
/**
 * A container with the public- and private key and the password salt
 */
export class CryptoConfig {

  constructor(
    public readonly publicKey: string,
    public readonly privateKey,
    public readonly digestSecret
  ) {}
}
