import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ScheduleModule } from '@nestjs/schedule';
import { DEFAULT_DB_HOST, DEFAULT_DB_PORT, EnvName } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuthModule } from './auth/auth.module';
import { AuthMiddleware } from './business/middleware';
import { AppBusinessModule } from './business/business.module';
import { AppCommonModule } from './common/common.module';
import { DbMiddleware } from './common/database/db.middleware';
import { fromEnv } from './common/env';
import { RequestFinishMiddleware } from './common/middleware';
import { SecondUtil } from './common/util';
import { LoginController } from './login.controller';
import { RegisterController } from './register.controller';
import { UserController } from './user.controller';

const controllers: any[] = [
  AppController,
  LoginController,
  RegisterController,
  UserController,
];

/**
 * Application module
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),

    AppCommonModule.forRoot({
      host: fromEnv(EnvName.DbHost).asString || DEFAULT_DB_HOST,
      port: fromEnv(EnvName.DbPort).asNumber || DEFAULT_DB_PORT,
      user: fromEnv(EnvName.DbUser).asString,
      database: fromEnv(EnvName.DbDatabase).asString,
      password: fromEnv(EnvName.DbPassword).asString,
      connectLimit: 20, // TODO Environment variable
    }),
    AppAuthModule.forRoot({
      priKeyFilename: fromEnv(EnvName.AuthPriFile).asString,
      pubKeyFilename: fromEnv(EnvName.AuthPubFile).asString,
    }),
    AppBusinessModule.forRoot({
      deviceExpires: SecondUtil.fromMinutes(fromEnv(EnvName.AuthExpires).asNumber || 7),
    }),
  ],
  controllers: [
    ...controllers,
  ],
  providers: [
    AppService
  ]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): any {

    const publicRoutes = ['/', '/check', '/about', '/login', '/register'];
    const allRoutes: RouteInfo = {
      path: '*',
      method: RequestMethod.ALL,
    };

    consumer
      .apply(RequestFinishMiddleware)
      .forRoutes(allRoutes)
      .apply(DbMiddleware)
      .forRoutes(allRoutes)
      .apply(AuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes(
        UserController,
      ); // TODO Add here all controllers
  }
}
