import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import Team from './team.model';
import Task from 'src/tasks/task.model';
import sequelize from 'src/db/database';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(private readonly projectsService: ProjectsService) {}

  async startTransaction() {
    return await sequelize.transaction();
  }

  async checkFieldExists(field: string) {
    if (!Object.keys(Team.getAttributes()).includes(field)) {
      throw new BadRequestException(
        `Field ${field} does not exist on Team model`,
      );
    }
  }

  async getTeam(teamId: number, field?: string): Promise<Team> {
    try {
      let team: Team;

      if (field) {
        await this.checkFieldExists(field);
        team = await Team.findByPk(teamId, { attributes: [field] });
      } else {
        team = await Team.findByPk(teamId);
      }

      if (!team) {
        throw new NotFoundException(`Team with ID ${teamId} not found`);
      }

      return team;
    } catch (error) {
      this.logger.error(`Failed to get team with ID: ${teamId}`, error.stack);
      throw error;
    }
  }

  async getTasksInTeams(teamId: number) {
    try {
      return await Task.findAll({
        where: {
          teamId: teamId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to get tasks in team with ID: ${teamId}`);
      throw error;
    }
  }

  async createTeam(
    createTeam: CreateTeamDto,
    transaction: Transaction,
  ): Promise<Team> {
    try {
      const projectId = await this.projectsService.getProjectId(
        createTeam.projectSlug,
      );

      if (typeof projectId === 'object' && 'error' in projectId) {
        throw new BadRequestException(projectId.error);
      }

      const team = await Team.create(
        {
          name: createTeam.name,
          projectId: projectId,
        },
        {
          transaction,
        },
      );

      return team;
    } catch (error) {
      this.logger.error(
        `Failed to create team with name: ${name}`,
        error.stack,
      );
      throw error;
    }
  }
}
