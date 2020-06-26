import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {

  getHello(name: string): string {
    return `Hello ${name || 'World'}!`;
  }
}
