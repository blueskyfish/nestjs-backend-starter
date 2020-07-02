import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { About, Alive, AliveService, SystemService } from '../business/system';
import { ErrorBody } from '../common/error';
import { HelloParams } from './params';

@ApiTags('System')
@Controller()
export class SystemController {

  constructor(private systemService: SystemService, private aliveService: AliveService) {}

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
  @Get('/')
  @Header('content-type', 'text/plain')
  getHello(@Query() params: HelloParams): string {
    return this.systemService.getHello(params.name);
  }

  @ApiOperation({
    description: 'Get alive entity from the backend',
    operationId: 'alive'
  })
  @ApiProduces('application/json')
  @ApiOkResponse({
    description: 'The alive entity',
    type: Alive
  })
  @Get('/alive')
  alive(): Alive {
    return this.aliveService.alive();
  }

  @ApiOperation({
    description: 'Get the about information',
    operationId: 'getAbout'
  })
  @ApiOkResponse({
    description: 'The about entity',
    type: About
  })
  @Get('/about')
  async getAbout(): Promise<About> {
    return await this.systemService.getAbout();
  }
}
