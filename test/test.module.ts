import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DEFAULT_DB_HOST } from '../src/app.config';
import { SystemController } from '../src/controller/system.controller';
import { SystemService } from '../src/business/system/system.service';
import { AppAuthModule } from '../src/auth/auth.module';
import { AppBusinessModule } from '../src/business/business.module';
import { AuthMiddleware } from '../src/business/middleware';
import { AppCommonModule } from '../src/common/common.module';
import { TimeUtil } from '../src/common/util';
import { LoginController } from '../src/controller/login.controller';
import { RegisterController } from '../src/controller/register.controller';
import { UserController } from '../src/controller/user.controller';
import {
  TEST_AUTH_PRI_FILENAME,
  TEST_AUTH_PUB_FILENAME,
  TEST_DB_DATABASE,
  TEST_DB_PASSWORD,
  TEST_DB_PORT,
  TEST_DB_USER
} from './test.settings';

/**
 * The test module
 */
@Module({
  imports: [
    AppCommonModule.forRoot({
      host: DEFAULT_DB_HOST,
      port: TEST_DB_PORT,
      user: TEST_DB_USER,
      database: TEST_DB_DATABASE,
      password: TEST_DB_PASSWORD,
      connectLimit: 20, // TODO Environment variable
    }),
    AppAuthModule.forRoot({
      priKeyFilename: TEST_AUTH_PRI_FILENAME,
      pubKeyFilename: TEST_AUTH_PUB_FILENAME,
    }),
    AppBusinessModule.forRoot({
      deviceExpires: TimeUtil.fromMinutes(2),
    }),
  ],
  controllers: [
    SystemController,
    LoginController,
    RegisterController,
    UserController,
  ],
  providers: [
    SystemService,
  ]
})
export class TestModule implements NestModule {

  configure(consumer: MiddlewareConsumer): any {
    const publicRoutes = ['/', '/check', '/about', '/login', '/register'];
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes(
        UserController,
      ); // TODO Add here all controllers
  }
}
