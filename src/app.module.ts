import { Module } from '@nestjs/common';
import { DEFAULT_DB_HOST, DEFAULT_DB_PORT, EnvName } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppCommonModule } from './common/common.module';
import { fromEnv } from './common/env';

const controllers: any[] = [
  AppController,
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
      connectLimit: 20, // TODO Enviroment variable
    }),
  ],
  controllers: [
    ...controllers,
  ],
  providers: [
    AppService
  ]
})
export class AppModule {}
