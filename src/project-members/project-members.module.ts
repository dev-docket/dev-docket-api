import { Module } from '@nestjs/common';
import { ProjectMembersController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService, ProjectsService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
