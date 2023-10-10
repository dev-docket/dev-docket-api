import { Injectable } from '@nestjs/common';
import ProjectInvitation from './project-invitation.model';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class ProjectInvitationsService {
  constructor(private readonly projectService: ProjectsService) {}

  async getInvitations(projectSlug: string) {
    const project = await this.projectService.getProject(projectSlug);

    return await ProjectInvitation.findAll({
      where: {
        projectId: project.id,
      },
    });
  }
}
