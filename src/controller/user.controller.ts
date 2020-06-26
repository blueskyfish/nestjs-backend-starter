import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { API_SECURITY } from '../auth';
import { AuthUser, GetAuthUser } from '../auth/user';
import { UserInfo } from '../business/user/entities';
import { UserService } from '../business/user';
import { ErrorBody } from '../common/error';

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
    security: API_SECURITY,
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
  async getInfo(@GetAuthUser() authUser: AuthUser): Promise<UserInfo> {
    return this.userService.getInfo(authUser);
  }
}
