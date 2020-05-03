import { Injectable } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { buildPassword, generateSalt, getSalt } from './password.util';

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
    const salt = getSalt(hashedPassword);
    const hash = this.cryptoService.digest(salt, password);
    const temp = buildPassword(salt, hash);
    return hashedPassword === temp;
  }
}
