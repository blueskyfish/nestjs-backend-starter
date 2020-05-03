import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from './user-info.bean';

/**
 * The bean with the user information and his token for authentication.
 */
export class LoginUser extends UserInfo {

  @ApiProperty({
    description: 'This is the user token for his authentication at protected endpoints'
  })
  token: string;
}
