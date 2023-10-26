import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty()
  username: string;
}

export class CompleteProfileDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;
}
