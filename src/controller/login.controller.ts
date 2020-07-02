import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginPayload, LoginUser } from '../business/user/entities';
import { UserService } from '../business/user';
import { ErrorBody } from '../common/error';

/**
 * The user login endpoint controller.
 */
@ApiTags('User')
@Controller()
export class LoginController {

  constructor(private userService: UserService) {
  }

  @ApiOperation({
    description: 'The login of an user. In case of success the result is the user information and his authentication token',
    operationId: 'login'
  })
  @ApiOkResponse({
    description: 'The user has successfully logged in',
    type: LoginUser,
  })
  @ApiBadRequestResponse({
    description: 'The user login is failed',
    type: ErrorBody
  })
  @Put('/login')
  async login(@Body() payload: LoginPayload): Promise<LoginUser> {
    return await this.userService.login(payload);
  }
}
