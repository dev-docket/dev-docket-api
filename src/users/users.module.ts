import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ProjectsService],
  exports: [UsersService],
})
export class UsersModule {}
