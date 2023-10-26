import { Module } from '@nestjs/common';
import { ProjectInvitations } from './project-invitations.controller';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectInvitationsService } from './project-invitations.service';
import { UsersService } from 'src/users/users.service';
import { ProjectMembersService } from 'src/project-members/project-members.service';

@Module({
  controllers: [ProjectInvitations],
  providers: [
    ProjectInvitationsService,
    ProjectsService,
    ProjectMembersService,
    UsersService,
  ],
  exports: [ProjectInvitationsService],
})
export class ProjectInvitationsModule {}
