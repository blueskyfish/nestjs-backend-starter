import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { DEFAULT_DB_HOST, DEFAULT_DB_PORT, EnvName } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuthModule } from './auth/auth.module';
import { AuthMiddlewareService } from './auth/web';
import { AppBusinessModule } from './business/business.module';
import { AppCommonModule } from './common/common.module';
import { DbMiddleware } from './common/database/db.middleware';
import { fromEnv } from './common/env';
import { RequestFinishMiddleware } from './common/middleware';
import { SecondUtil } from './common/util';
import { LoginController } from './login.controller';

const controllers: any[] = [
  AppController,
  LoginController
];

/**
 * Application module
 */
@Module({
  imports: [
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
      expires: SecondUtil.fromDays(fromEnv(EnvName.AuthExpires).asNumber || 7),
      headerName: fromEnv(EnvName.AuthHeader).asString || 'x-starter-key',
    }),
    AppBusinessModule,
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

    const allRoutes: RouteInfo = {
      path: '*',
      method: RequestMethod.ALL,
    };

    consumer
      .apply(RequestFinishMiddleware)
      .forRoutes(allRoutes)
      .apply(DbMiddleware)
      .exclude('/about')
      .forRoutes(allRoutes)
      .apply(AuthMiddlewareService)
      .exclude('/', '/check', '/about', '/login', '/register')
      .forRoutes('*'); // TODO Add here all controllers
  }
}
