import { Injectable } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { buildPassword, generateSalt, getSalt } from './password.util';

/**
 * The service create formatted password or check plain password with formatted password.
 *
 * The format of the password is in 3 parts separated
 *
 * * Version Information
 * * User Salt
 * * Hashed Password
 *
 * The hashed password is generates from the global salt ({@link CryptoConfig.passwordSalt}, the user salt and
 * the plain password.
 *
 * Together with the version information, the user salt and the hashed password is stored and managed the password.
 */
@Injectable()
export class PasswordService {

  constructor(private cryptoService: CryptoService) {
  }

  generatePassword(password: string): string {
    const salt = generateSalt();
    const hash = this.cryptoService.digest(salt, password);
    return buildPassword(salt, hash);
  }

  checkPassword(hashedPassword: string, password: string): boolean {
    if (hashedPassword.startsWith('-')) {
      // plain password
      return password === hashedPassword.substring(1);
    }

    const salt = getSalt(hashedPassword);
    const hash = this.cryptoService.digest(salt, password);
    const temp = buildPassword(salt, hash);
    return hashedPassword === temp;
  }
}
