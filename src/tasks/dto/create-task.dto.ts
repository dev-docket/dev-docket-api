import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsIn(['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'])
  status: string;

  @ApiProperty()
  @IsNumber()
  teamId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
