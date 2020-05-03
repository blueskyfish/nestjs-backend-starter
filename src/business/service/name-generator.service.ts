import { Injectable } from '@nestjs/common';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

/**
 * Generates an name pair.
 */
@Injectable()
export class NameGeneratorService {

  private readonly config: Config = {
    dictionaries: [adjectives, colors],
    separator: '_',
    length: 2,
  }

  generatorName(): string {
    return uniqueNamesGenerator(this.config);
  }
}
