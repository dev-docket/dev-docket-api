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
