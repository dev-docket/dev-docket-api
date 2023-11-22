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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetTeamResponse } from './dto/get-team-response.dto';
import { TeamMembersService } from 'src/team-members/team-members.service';
import Team from './team.model';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('api/v1/teams')
@ApiTags('Teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamMembersService: TeamMembersService,
  ) {}

  @Get(':teamId')
  @ApiQuery({
    name: 'field',
    required: false,
    description: 'The field to return from the Team',
  })
  @ApiOperation({ summary: 'Get a team by its ID' })
  @ApiParam({ name: 'teamId', description: 'The ID of the team to retrieve' })
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

  @Get(':teamId/tasks')
  @ApiOperation({ summary: 'Get tasks within a specific team' })
  @ApiParam({
    name: 'teamId',
    description: 'The ID of the team to retrieve tasks for',
  })
  @ApiResponse({ status: 200, description: 'List of tasks within the team' })
  async getTasksInTeams(@Param('teamId', new ParseIntPipe()) teamId: number) {
    try {
      return await this.teamsService.getTasksInTeams(teamId);
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
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({
    description: 'The data needed to create a new team',
    type: CreateTeamDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The team has been successfully created',
    type: Team,
  })
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    const transaction = await this.teamsService.startTransaction();
    try {
      const createdTeam = await this.teamsService.createTeam(
        createTeamDto,
        transaction,
      );
      await this.teamMembersService.create(
        createTeamDto.userId,
        createdTeam.id,
        transaction,
      );

      transaction.commit();
      return createdTeam;
    } catch (error) {
      transaction.rollback();
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
