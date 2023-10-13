import { ApiProperty } from '@nestjs/swagger';
// import { IsIn } from 'class-validator';

export class UpdateTaskPartialDto {
  @ApiProperty()
  public id?: number;

  @ApiProperty()
  public name?: string;

  @ApiProperty()
  // @IsIn(['TODO', 'IN_PROGRESS', 'DONE'])
  public status?: string;

  @ApiProperty()
  public description?: string;

  @ApiProperty()
  public teamId?: number;
}
