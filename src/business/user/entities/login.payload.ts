import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

/**
 * The payload body of the login request
 */
export class LoginPayload {

  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user',
    required: true,
  })
  email: string;

  @MinLength(8)
  @ApiProperty({
    description: 'The user password',
    required: true,
  })
  password: string;
}
