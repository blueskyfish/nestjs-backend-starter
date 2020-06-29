import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EnvName } from './app.config';
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
      digestSecret: fromEnv(EnvName.DigestSecret).asString,
    }),
    AppControllerModule,
  ],
})
export class AppModule implements NestModule {

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
