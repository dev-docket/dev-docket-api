import { Controller } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';

@Controller('projects/:projectSlug/members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  // @Get()
  // getAllMembers(@Param('projectSlug') projectSlug: string) {
  //   return this.projectMembersService.getAllMembers(projectSlug);
  // }

  // @Get('invites')
  // getAllInvitations(@Param('projectSlug') projectSlug: string) {
  //   return this.projectMembersService.getAllInvitations(projectSlug);
  // }

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
