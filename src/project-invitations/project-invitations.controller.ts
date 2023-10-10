import { Controller, Get, Param } from '@nestjs/common';
import { ProjectInvitationsService } from './project-invitations.service';

@Controller('api/v1/projects')
export class ProjectInvitations {
  constructor(
    private readonly projectInvitationsService: ProjectInvitationsService,
  ) {}

  @Get(':projectSlug/invitations')
  async getInvitations(@Param('projectSlug') projectSlug: string) {
    return await this.projectInvitationsService.getInvitations(projectSlug);
  }
}
