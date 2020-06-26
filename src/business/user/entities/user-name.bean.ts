import { ApiProperty } from '@nestjs/swagger';

/**
 * The user with his name
 */
export class UserName {

  @ApiProperty({
    description: 'The user id',
    required: true
  })
  id: number;

  @ApiProperty({
    description: 'The user name',
    required: true,
  })
  name: string;
}
