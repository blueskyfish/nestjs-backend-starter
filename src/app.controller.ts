import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiProperty } from '@nestjs/swagger';
import { MaxLength, ValidateIf } from 'class-validator';
import { AppService } from './app.service';
import { ErrorBody } from './common/error';

// TODO: One Class per file: Mode to own file
export class QueryHelloParams {

  @ApiProperty({description: 'Your Name (max 20 signs)', required: false})
  @ValidateIf((p) => !!p.name)
  @MaxLength(20, {message: 'The name is too long (max 20 signs)'})
  readonly name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    description: 'Get hello world',
    operationId: 'getHello'
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    status: 200,
    description: 'The Hello response',
    type: String
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'The validation error message',
    type: ErrorBody
  })
  @Get(['/', 'check'])
  getHello(@Query() params: QueryHelloParams): string {
    return this.appService.getHello(params.name);
  }
}
