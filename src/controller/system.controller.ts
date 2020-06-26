import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { SystemService } from '../business/system/system.service';
import { ErrorBody } from '../common/error';
import { HelloParams } from './params';

@ApiTags('System')
@Controller()
export class SystemController {

  constructor(private appService: SystemService) {}

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
  @Get(['/'])
  getHello(@Query() params: HelloParams): string {
    return this.appService.getHello(params.name);
  }
}
