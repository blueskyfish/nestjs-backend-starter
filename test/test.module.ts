import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as path from 'path';
import { AppAuthModule } from '../src/auth/auth.module';
import { AuthMiddleware } from '../src/auth/user';
import { AppBusinessModule } from '../src/business/business.module';
import { SystemService } from '../src/business/system';
import { AppCommonModule } from '../src/common/common.module';
import { LoginController } from '../src/controller/login.controller';
import { RegisterController } from '../src/controller/register.controller';
import { SystemController } from '../src/controller/system.controller';
import { UserController } from '../src/controller/user.controller';
import { TEST_AUTH_PRI_FILENAME, TEST_AUTH_PUB_FILENAME } from './test.settings';

/**
 * The test module
 */
@Module({
  imports: [
    AppCommonModule.forRoot({
      db: {
        type: 'sqlite',
        filename: path.join(process.cwd(), 'test', 'starter.db'),
      },
      appHome: process.cwd(),
    }),
    AppAuthModule.forRoot({
      priKeyFilename: TEST_AUTH_PRI_FILENAME,
      pubKeyFilename: TEST_AUTH_PUB_FILENAME,
      digestSecret: 'ABC123'
    }),
    AppBusinessModule,
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
