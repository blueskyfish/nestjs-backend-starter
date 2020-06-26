import { INestApplication, NotFoundException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as _ from 'lodash';
import { DEFAULT_HOST, EnvName } from './app.config';
import { AppModule } from './app.module';
import { API_KEY_NAME, HTTP_AUTH_HEADER } from './auth';
import { fromEnv } from './common/env';
import { BootstrapError, ErrorHandlerFilter, ValidError } from './common/error';

async function bootstrap() {

  const host = fromEnv(EnvName.Host).asString || DEFAULT_HOST;
  const port = fromEnv(EnvName.PORT).asNumber;

  if (isNaN(port) || port <= 0) {
    throw new BootstrapError('Port', 'Server port is required. Set environment "PORT"');
  }

  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalFilters(new ErrorHandlerFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      // Implicit type conversion: https://docs.nestjs.com/migration-guide#implicit-type-conversion-validationpipe
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      // customized the error response
      exceptionFactory: (errors: ValidationError[]) => {
        return new ValidError(errors);
      }
    })
  );

  // Open API Configuration

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
    if (_.toUpper(req.method) === 'GET') {
      return res.send(document);
    }
    next(new NotFoundException());
  });

  // Start the listen of the server
  await app.listen(port, host, () => {
    console.info('> Info: Backend Server is listen http://%s:%s/', host, port);
  });
}

bootstrap()
  .catch(reason => {
    console.error('> Error: Bootstrap is failed =>', reason);
    process.exit(-1);
  });
