import { Injectable, Logger } from '@nestjs/common';
import TeamMember from './team-member.model';

@Injectable()
export class TeamMembersService {
  private readonly logger = new Logger(TeamMembersService.name);

  async create(userId: number, teamId: number): Promise<void> {
    try {
      await TeamMember.create({
        userId,
        teamId,
        role: 'owner',
      });

      return;
    } catch (error) {
      this.logger.error(
        `Failed to create team member with user ID: ${userId} and team ID: ${teamId}`,
        error.stack,
      );
      throw error;
    }
  }
}
