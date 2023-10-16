import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ProjectInvitationsService } from './project-invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/projects')
@ApiTags('Projects Invitations')
export class ProjectInvitations {
  constructor(
    private readonly projectInvitationsService: ProjectInvitationsService,
  ) {}

  @Get(':projectSlug/invitations')
  async getInvitations(@Param('projectSlug') projectSlug: string) {
    return await this.projectInvitationsService.getInvitations(projectSlug);
  }

  @Get(':projectSlug/invitations/:invitationToken')
  async getInvitation(
    @Param('projectSlug') projectSlug: string,
    @Param('invitationToken') invitationToken: string,
  ) {
    return await this.projectInvitationsService.getInvitation(
      projectSlug,
      invitationToken,
    );
  }

  @Post(':projectSlug/invitations')
  async createInvitation(
    @Param('projectSlug') projectSlug: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    try {
      return await this.projectInvitationsService.createInvitation(
        projectSlug,
        createInvitationDto,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          message: error.message,
        },
        400,
      );
    }
  }

  @Post(':projectSlug/invitations/:invitationToken/accept')
  async acceptInvitation(
    @Param('projectSlug') projectSlug: string,
    @Param('invitationToken') invitationToken: string,
    @Res() res: Response,
  ) {
    try {
      await this.projectInvitationsService.acceptInvitation(
        projectSlug,
        invitationToken,
      );

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          message: error.message,
        },
        400,
      );
    }
  }
}
