import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.controller';
import { ProjectMembersService } from 'src/project-members/project-members.service';

@Module({
  imports: [],
  controllers: [Projects],
  providers: [ProjectsService, ProjectMembersService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
