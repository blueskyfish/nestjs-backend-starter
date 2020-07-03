import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import * as path from 'path';
import { buildDatabaseConfig, EnvName } from './app.config';
import { AppAuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/user';
import { AppCommonModule } from './common/common.module';
import { fromEnv } from './common/env';
import { AppControllerModule } from './controller/controller.module';
import { UserController } from './controller/user.controller';

/**
 * Application module
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),

    AppCommonModule.forRoot({
      // database config
      db: buildDatabaseConfig(),
      // setting config
      appHome: fromEnv(EnvName.AppHome).asString || path.normalize(path.join(__dirname, '..')),
    }),
    AppAuthModule.forRoot({
      priKeyFilename: fromEnv(EnvName.AuthPriFile).asString,
      pubKeyFilename: fromEnv(EnvName.AuthPubFile).asString,
      digestSecret: fromEnv(EnvName.DigestSecret).asString,
    }),
    AppControllerModule,
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): any {

    const publicRoutes = ['/', '/about', '/alive', '/about', '/login', '/register'];

    consumer
      .apply(AuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes(
        UserController,
      ); // TODO Add here all controllers
  }
}
