import { Injectable, Logger } from '@nestjs/common';
import ProjectMember from 'src/project-members/project-member.model';
import Project from './project.model';
import { Op } from 'sequelize';
import { Team } from 'src/teams/team.model';
import { CreateProjectDto } from './dto/create-project.dto';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

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

  async getProjectId(projectSlug: string) {
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

      return project.id;
    } catch (error) {
      this.logger.error('Error getting project id', error.stack);
    }
  }

  async createProject(createProjectDto: CreateProjectDto) {
    try {
      const { user: userDto, project: projectDto } = createProjectDto;

      const project = await Project.create({
        name: userDto.id,
        slug: `${slugify(projectDto.name)}-${nanoid(4)}`,
      });

      return project;
    } catch (error) {
      this.logger.error('Error creating project', error.stack);
    }
  }
}
