import { Injectable, Logger } from '@nestjs/common';
import TeamMember from './team-member.model';
import { Transaction } from 'sequelize';

@Injectable()
export class TeamMembersService {
  private readonly logger = new Logger(TeamMembersService.name);

  async create(
    userId: number,
    teamId: number,
    transaction: Transaction,
  ): Promise<void> {
    try {
      await TeamMember.create(
        {
          userId,
          teamId,
          role: 'owner',
        },
        {
          transaction,
        },
      );

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
