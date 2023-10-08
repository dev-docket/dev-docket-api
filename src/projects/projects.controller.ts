import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import Project from './project.model';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMembersService } from 'src/project-members/project-members.service';

@Controller('api/v1/projects')
@ApiTags('Projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  @Get(':projectSlug')
  @ApiOkResponse({
    description: 'The project has been successfully returned.',
    type: Project,
  })
  async getProject(
    @Param('projectSlug') projectSlug: string,
  ): Promise<Project> {
    return await this.projectsService.getProject(projectSlug);
  }

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

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectsService.createProject(createProjectDto);
    await this.projectMembersService.createProjectMember(
      createProjectDto.user.id,
      project.id,
      'owner',
    );
  }
}
