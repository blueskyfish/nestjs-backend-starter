import { Module } from '@nestjs/common';
import { UserService } from './user';

// Here are the service for global using in other modules
const globalServices: any[] = [
  UserService,
];

// Her are only services for internal using.
const internalServices: any[] = [

];

@Module({
  providers: [
    ...internalServices,
    ...globalServices,
  ],
  exports: [
    ...globalServices,
  ]
})
export class AppBusinessModule {
  // TODO: "App" => Rename the shortcut with your project specifications


}
