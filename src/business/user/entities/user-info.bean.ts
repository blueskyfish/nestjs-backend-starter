import { ApiProperty } from '@nestjs/swagger';
import { UserName } from './user-name.bean';

/**
 * The user information with his name and email.
 */
export class UserInfo extends UserName {

  @ApiProperty({
    description: 'The email of the user'
  })
  email: string;
}
