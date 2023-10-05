import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetTeamResponse } from './dto/get-team-response.dto';

@Controller('teams')
@ApiTags('Teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

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
}
