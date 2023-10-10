import { Module } from '@nestjs/common';
import { ProjectInvitations } from './project-invitations.controller';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectInvitationsService } from './project-invitations.service';

@Module({
  controllers: [ProjectInvitations],
  providers: [ProjectInvitationsService, ProjectsService],
  exports: [ProjectInvitationsService],
})
export class ProjectInvitationsModule {}
