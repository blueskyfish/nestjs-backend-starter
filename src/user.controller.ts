import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { API_KEY_STARTER, AuthUser } from './auth/';
import { UserInfo } from './business/entities';
import { User } from './business/middleware';
import { UserService } from './business/user';
import { ErrorBody } from './common/error';

/**
 * The user controller manages the current user.
 */
@ApiTags('User')
@Controller('/user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @ApiOperation({
    description: 'Get the information of the current user',
    operationId: 'getInfo',
    security: API_KEY_STARTER,
  })
  @ApiOkResponse({
    description: 'The current user information',
    type: UserInfo,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorization access',
    type: ErrorBody,
  })
  @Get('/info')
  async getInfo(@User() authUser: AuthUser): Promise<UserInfo> {
    return this.userService.getInfo(authUser);
  }
}
