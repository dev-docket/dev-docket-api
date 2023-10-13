import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { GetAllMembersResponseDto } from './dto/get-all-members-response.dto';
import { Response } from 'express';

@Controller('api/v1/projects')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Get(':projectSlug/members')
  async getAllMembers(
    @Param('projectSlug') projectSlug: string,
  ): Promise<GetAllMembersResponseDto[]> {
    return await this.projectMembersService.getAllMembers(projectSlug);
  }

  @Delete(':projectSlug/members/:userId')
  async removeMember(
    @Param('projectSlug') projectSlug: string,
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    try {
      await this.projectMembersService.removeMember(projectSlug, userId);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
  }
}
