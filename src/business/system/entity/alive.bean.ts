/**
 * The alive response entity
 */
import { ApiProperty } from '@nestjs/swagger';

export class Alive {
  @ApiProperty({
    description: 'The start time'
  })
  start: string;

  @ApiProperty({
    description: 'The duration'
  })
  duration: string;
}
