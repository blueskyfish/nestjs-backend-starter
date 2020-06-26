import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';

const repositoryServices: any[] = [
  RepositoryService,
];

/**
 * Work with the repository data
 */
@Module({
  providers: [
    ...repositoryServices,
  ],
  exports: [
    ...repositoryServices,
  ]
})
export class AppRepositoryModule {
  // TODO: "App" => Rename the shortcut with your project specifications
}
