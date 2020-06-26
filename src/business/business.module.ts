import { Module } from '@nestjs/common';
import { AppRepositoryModule } from '../repository/repository.module';
import { SystemService } from './system/system.service';
import { UserService } from './user';

// Here are the service for global using in other modules
const businessServices: any[] = [
  UserService,
  SystemService,
];


@Module({
  imports: [
    AppRepositoryModule,
  ],
  providers: [
    ...businessServices,
  ],
  exports: [
    ...businessServices,
  ]
})
export class AppBusinessModule {
  // TODO: "App" => Rename the shortcut with your project specifications
}
