import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUser, RegisterPayload } from './business/entities';
import { UserService } from './business/user';
import { DbConn, DbConnection } from './common/database';
import { ErrorBody } from './common/error';

/**
 * The user register endpoint.
 */
@ApiTags('User')
@Controller()
export class RegisterController {

  constructor(private userService: UserService) {
  }

  @ApiOperation({
    description: 'A user try to register. In case of success the result is the user information and his authentication token',
    operationId: 'register'
  })
  @ApiOkResponse({
    description: 'The user has successfully registered',
    type: LoginUser,
  })
  @ApiBadRequestResponse({
    description: 'The user register is failed',
    type: ErrorBody
  })
  @Post('/register')
  async register(@DbConn() conn: DbConnection, @Body() payload: RegisterPayload): Promise<LoginUser> {
    return await this.userService.register(conn, payload);
  }
}
