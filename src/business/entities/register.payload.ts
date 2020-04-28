import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, MinLength } from 'class-validator';

/**
 * Register a new user.
 */
export class RegisterPayload {

  @MinLength(3)
  @ApiProperty({
    description: 'The user name',
    required: true
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'The user email',
    required: true,
  })
  email: string;

  @MinLength(8)
  @ApiProperty({
    description: 'The user password (less 8 signs or more)',
    required: true,
  })
  password: string;

  @IsArray()
  @ApiProperty({
    description: 'The list of roles',
    required: true,
    isArray: true,
    type: String,
  })
  roles: string[];
}
