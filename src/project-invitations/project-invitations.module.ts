import { Module } from '@nestjs/common';
import { ProjectInvitations } from './project-invitations.controller';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectInvitationsService } from './project-invitations.service';
import { UsersService } from 'src/user/users.service';

@Module({
  controllers: [ProjectInvitations],
  providers: [ProjectInvitationsService, ProjectsService, UsersService],
  exports: [ProjectInvitationsService],
})
export class ProjectInvitationsModule {}
