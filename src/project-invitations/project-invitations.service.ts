import { Injectable } from '@nestjs/common';
import ProjectInvitation from './project-invitation.model';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class ProjectInvitationsService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly usersSerivce: UsersService,
  ) {}

  async getInvitations(projectSlug: string) {
    const project = await this.projectsService.getProject(projectSlug);

    const projectInvitations = await ProjectInvitation.findAll({
      where: {
        projectId: project.id,
      },
    });

    // projectInvitations have userIds, but we want to return the full user objects
    // so we need to fetch the user objects from the database
    const users = await Promise.all(
      projectInvitations.map((projectInvitation) =>
        this.usersSerivce.getUserById(projectInvitation.userId),
      ),
    );

    // We need to return the user objects along with the projectInvitations
    // so we need to map over the projectInvitations and return a new object
    // with the user object included
    return projectInvitations.map((projectInvitation, index) => ({
      ...projectInvitation.toJSON(),
      user: users[index],
    }));
  }

  async getInvitation(projectSlug: string, invitationToken: string) {
    const project = await this.projectsService.getProject(projectSlug);

    const projectInvitation = await ProjectInvitation.findOne({
      where: {
        projectId: project.id,
        token: invitationToken,
      },
    });

    const user = await this.usersSerivce.getUserById(projectInvitation.userId);

    return {
      ...projectInvitation.toJSON(),
      project,
      user,
    };
  }
}
