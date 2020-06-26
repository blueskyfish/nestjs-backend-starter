import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, ValidateIf } from 'class-validator';

export class HelloParams {

  @ApiProperty({description: 'Your Name (max 20 signs)', required: false})
  @ValidateIf((p) => !!p.name)
  @MaxLength(20, {message: 'The name is too long (max 20 signs)'})
  readonly name: string;
}
