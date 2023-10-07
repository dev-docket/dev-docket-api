import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetTeamResponse } from './dto/get-team-response.dto';
import { TeamMembersService } from 'src/team-members/team-members.service';
import { Team } from './team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { ProjectsService } from 'src/projects/projects.service';

@Controller('teams')
@ApiTags('Teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamMembersSerice: TeamMembersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get(':teamId')
  @ApiQuery({
    name: 'field',
    required: false,
    description: 'The field to return from the Team',
  })
  @ApiOkResponse({
    description:
      'The team has been successfully returned with the given field.',
    type: GetTeamResponse,
  })
  async getTeam(
    @Param('teamId', new ParseIntPipe()) teamId: number,
    @Query('field') field?: string,
  ): Promise<GetTeamResponse> {
    try {
      return await this.teamsService.getTeam(teamId, field);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const projectId = await this.projectsService.getProjectId(
        createTeamDto.projectSlug,
      );

      if (typeof projectId === 'object' && 'error' in projectId) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: projectId.error,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const createdTeam = await this.teamsService.createTeam(
        createTeamDto.name,
        projectId,
      );
      await this.teamMembersSerice.create(
        createTeamDto.ownerId,
        createdTeam.id,
      );
      return createdTeam;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
