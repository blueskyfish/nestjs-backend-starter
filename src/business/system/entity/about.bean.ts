/**
 * The about bean
 */
import { ApiProperty } from '@nestjs/swagger';

export class About {

  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  commit: string;

  @ApiProperty()
  commitDate: string;

  @ApiProperty()
  branch: string;

  @ApiProperty()
  branchDate: string;
}
