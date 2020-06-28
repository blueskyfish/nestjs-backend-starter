import { ApiProperty } from '@nestjs/swagger';

/**
 * The body of an error
 */
export class ErrorBody {

  @ApiProperty({
    description: 'The request method',
    required: false,
  })
  readonly method: string;

  @ApiProperty({
    description: 'The request url with all parts of the query',
    required: false,
  })
  readonly url: string;

  @ApiProperty({
    description: 'The error group',
    required: true,
  })
  readonly group: string;

  @ApiProperty({
    description: 'The error code',
    required: true,
  })
  readonly code: string;

  @ApiProperty({
    description: 'The message of the error occurretion',
    required: true,
  })
  readonly message: string;

  @ApiProperty({
    description: 'The stacktrace of the error',
    required: false,
    isArray: true,
    type: String
  })
  readonly stack?: string[];

  @ApiProperty({
    description: 'An optional data properties',
    required: false,
  })
  readonly data?: any;
}
