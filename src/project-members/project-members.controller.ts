import { Controller, Get, Param } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { GetAllMembersResponseDto } from './dto/get-all-members-response.dto';

@Controller('api/v1/projects')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Get(':projectSlug/members')
  async getAllMembers(
    @Param('projectSlug') projectSlug: string,
  ): Promise<GetAllMembersResponseDto[]> {
    return await this.projectMembersService.getAllMembers(projectSlug);
  }

  // @Post('invites')
  // generateInvitation(
  //   @Param('projectSlug') projectSlug: string,
  //   @Body() inviteData: any,
  // ) {
  //   return this.projectMembersService.generateInvitation(
  //     projectSlug,
  //     inviteData,
  //   );
  // }
}
