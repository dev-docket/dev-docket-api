import { Controller } from '@nestjs/common';

@Controller('team-members')
export class TeamMembersController {
  create() {
    return 'This action adds a new team member';
  }
}
