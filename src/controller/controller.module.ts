import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { AppBusinessModule } from '../business/business.module';
import { LoginController } from './login.controller';
import { RegisterController } from './register.controller';
import { UserController } from './user.controller';


@Module({
  imports: [
    AppBusinessModule,
  ],
  controllers: [
    SystemController,
    LoginController,
    RegisterController,
    UserController,
  ],
})
export class AppControllerModule {
  // TODO: "App" => Rename the shortcut with your project specifications
}
