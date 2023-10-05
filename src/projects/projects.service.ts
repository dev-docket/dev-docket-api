import { Injectable, Logger } from '@nestjs/common';
import ProjectMember from 'src/project-members/project-member.model';
import Project from './project.model';
import { Op } from 'sequelize';
import { Team } from 'src/teams/team.model';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  async getUserProjects(userId: number) {
    try {
      const projectMembers = await ProjectMember.findAll({
        where: {
          user_id: userId,
        },
        attributes: ['projectId'],
      });

      const projectIds = projectMembers.map(
        (projectMember) => projectMember.projectId,
      );

      const projects = await Project.findAll({
        where: {
          id: {
            [Op.in]: projectIds,
          },
        },
        attributes: ['id', 'name', 'slug'],
      });

      return projects;
    } catch (error) {
      this.logger.error('Error getting user projects', error.stack);
    }
  }

  /**
   *  Get the teams of a project
   */
  async getProjectTeams(projectSlug: string) {
    try {
      const project = await Project.findOne({
        where: {
          slug: projectSlug,
        },
        attributes: ['id'],
      });

      if (!project) {
        return { error: 'Project not found' };
      }

      const teamsInProject = await Team.findAll({
        where: {
          projectId: project.id,
        },
      });

      return teamsInProject;
    } catch (error) {
      this.logger.error('Error getting project teams', error.stack);
    }
  }
}
