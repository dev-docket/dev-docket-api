import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import Project from './project.model';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { Response } from 'express';

@Controller('api/v1/projects')
@ApiTags('Projects')
export class Projects {
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
    const transaction = await this.projectsService.startTransaction();
    try {
      const project = await this.projectsService.createProject(
        createProjectDto,
        transaction,
      );

      await this.projectMembersService.createProjectMember(
        createProjectDto.user.id,
        project.id,
        'owner',
      );

      return project;
    } catch (error) {
      await transaction.rollback();
    }
  }

  @Delete(':projectSlug')
  async deleteProject(
    @Param('projectSlug') projectSlug: string,
    @Res() res: Response,
  ) {
    const transaction = await this.projectsService.startTransaction();

    try {
      await this.projectsService.deleteProject(projectSlug, transaction);

      await transaction.commit();
      return res.status(204).send();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
