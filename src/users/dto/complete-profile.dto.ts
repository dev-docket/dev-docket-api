import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class UserDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;
}

export class CompleteProfileDto {
  @ApiProperty({ type: UserDto })
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
