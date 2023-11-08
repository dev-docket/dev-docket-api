import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
// import { IsIn } from 'class-validator';

export class UpdateTaskPartialDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  // @IsIn(['TODO', 'IN_PROGRESS', 'DONE'])
  status?: string;

  @ApiProperty()
  priority?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  @IsNumber()
  teamId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
