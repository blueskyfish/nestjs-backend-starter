import { Logger, NotFoundException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DEFAULT_HOST, EnvName } from './app.config';
import { AppModule } from './app.module';
import { API_KEY_NAME, HTTP_AUTH_HEADER } from './auth';
import { fromEnv } from './common/env';
import { BootstrapError, ErrorHandlerFilter, ValidError } from './common/error';
import { Stage, StageService } from './common/stage';
import { toUpper } from './common/util';

async function bootstrap() {

  const host = fromEnv(EnvName.Host).asString || DEFAULT_HOST;
  const port = fromEnv(EnvName.PORT).asNumber;

  if (isNaN(port) || port <= 0) {
    throw new BootstrapError('Port', 'Server port is required. Set environment "PORT"');
  }

  const app = await NestFactory.create(AppModule);

  // get the logger (service)
  const logger = app.get(Logger);
  const stageService = app.get(StageService);

  app.enableShutdownHooks();
  app.useGlobalFilters(
    new ErrorHandlerFilter({ logger, useStack: stageService.stage !== Stage.Prod }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // Implicit type conversion: https://docs.nestjs.com/migration-guide#implicit-type-conversion-validationpipe
      transform: true,
      // customized the error response
      exceptionFactory: (errors: ValidationError[]) => {
        return new ValidError(errors);
      }
    })
  );

  if (stageService.stage !== Stage.Prod) {
    // (only on dev stage) Open API Configuration
    const options = new DocumentBuilder()
      .setTitle('NestJS Backend Starter')
      .setDescription('The OpenAPI documentation for "NestJS Backend Starter"')
      .setVersion('1.0')
      .addSecurity(API_KEY_NAME, {
        name: HTTP_AUTH_HEADER,
        in: 'header',
        type: 'apiKey',
        description: 'The api key for access for protected resource (contains the current user information)'
      })
      .build();
    const document = SwaggerModule.createDocument(app, options);

    // The OpenAP UI is available under http://$host:$port/openapi-ui
    SwaggerModule.setup('openapi-ui', app, document);
    // The OpenAPI document is available under GET: http://$host:$port/openapi.json
    app.use('/openapi.json', (req, res, next) => {
      if (toUpper(req.method) === 'GET') {
        return res.send(document);
      }
      next(new NotFoundException());
    });
  }

  // Start the listen of the server
  await app.listen(port, host, () => {
    logger.log(`Backend Server (${stageService}) is listen http://${host}:${port}/`, 'Bootstrap');
  });
}

bootstrap()
  .catch(reason => {
    console.error('> Error: Bootstrap is failed =>', reason);
    process.exit(-1);
  });
