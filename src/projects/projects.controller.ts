import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('users/:userId')
  async getUserProjects(@Param('userId', new ParseIntPipe()) userId: number) {
    return await this.projectsService.getUserProjects(userId);
  }
}
