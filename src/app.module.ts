import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ScheduleModule } from '@nestjs/schedule';
import { EnvName } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuthModule } from './auth/auth.module';
import { AppBusinessModule } from './business/business.module';
import { AuthMiddleware } from './business/middleware';
import { AppCommonModule } from './common/common.module';
import { fromEnv } from './common/env';
import { TimeUtil } from './common/util';
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
      host: fromEnv(EnvName.DbHost).asString ,
      port: fromEnv(EnvName.DbPort).asNumber,
      user: fromEnv(EnvName.DbUser).asString,
      database: fromEnv(EnvName.DbDatabase).asString,
      password: fromEnv(EnvName.DbPassword).asString,
      connectTimeout: fromEnv(EnvName.DbConnectTimeout).asNumber,
      connectLimit: fromEnv(EnvName.DbConnectLimit).asNumber,
      acquireTimeout: fromEnv(EnvName.DbAcquireTimeout).asNumber,
      waitForConnections: fromEnv(EnvName.DbWaitForConnections).asBool,
      queueLimit: fromEnv(EnvName.DbQueueLimit).asNumber,
    }),
    AppAuthModule.forRoot({
      priKeyFilename: fromEnv(EnvName.AuthPriFile).asString,
      pubKeyFilename: fromEnv(EnvName.AuthPubFile).asString,
    }),
    AppBusinessModule.forRoot({
      deviceExpires: TimeUtil.fromMinutes(fromEnv(EnvName.AuthExpires).asNumber || 7),
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
      .apply(AuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes(
        UserController,
      ); // TODO Add here all controllers
  }
}
