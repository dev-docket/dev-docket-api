import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import Project from './project.model';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('projects')
@ApiTags('Projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('users/:userId')
  @ApiOkResponse({
    description: 'The projects have been successfully returned.',
    type: [Project],
  })
  async getUserProjects(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<Project[]> {
    return await this.projectsService.getUserProjects(userId);
  }

  @Get(':projectSlug/teams')
  async getProjectTeams(@Param('projectSlug') projectSlug: string) {
    return await this.projectsService.getProjectTeams(projectSlug);
  }
}
