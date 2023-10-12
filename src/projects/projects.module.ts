import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.controller';
import { ProjectMembersModule } from 'src/project-members/project-members.module';

@Module({
  imports: [ProjectMembersModule],
  controllers: [Projects],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
