import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class Project {
  @ApiProperty()
  @IsNumber()
  name: string;
}

class User {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class CreateProjectDto {
  @ApiProperty({ type: () => Project })
  project: Project;

  @ApiProperty({ type: () => User })
  user: User;
}
