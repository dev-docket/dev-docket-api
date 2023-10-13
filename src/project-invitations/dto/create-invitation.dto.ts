import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNumber()
  creatorId: number;
}
