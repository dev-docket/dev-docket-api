import { Injectable, Logger } from '@nestjs/common';
import ProjectMember from 'src/project-members/project-member.model';
import Project from './project.model';
import { Op, Transaction } from 'sequelize';
import Team from 'src/teams/team.model';
import { CreateProjectDto } from './dto/create-project.dto';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { UpdateProjectDto } from './dto/update.project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  async updateProject(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
    transaction: Transaction,
  ) {
    try {
      await Project.update(
        {
          name: updateProjectDto.name,
          slug: `${slugify(updateProjectDto.name)}-${nanoid(4)}`,
        },
        {
          where: {
            id: projectId,
          },
          transaction,
        },
      );

      return await Project.findOne({
        where: {
          id: projectId,
        },
        transaction,
      });
    } catch (error) {
      this.logger.error('Error updating project', error.stack);
    }
  }

  async startTransaction() {
    return await Project.sequelize.transaction();
  }

  async getProject(projectSlug: string) {
    try {
      const project = await Project.findOne({
        where: {
          slug: projectSlug,
        },
      });

      return project;
    } catch (error) {
      this.logger.error('Error getting project', error.stack);
    }
  }

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

  async getProjectId(projectSlug: string): Promise<number | { error: string }> {
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

  async createProject(
    createProjectDto: CreateProjectDto,
    transaction: Transaction,
  ): Promise<Project> {
    try {
      const { project: projectDto } = createProjectDto;

      const project = await Project.create(
        {
          name: projectDto.name,
          slug: `${slugify(projectDto.name)}-${nanoid(4)}`,
        },
        { transaction },
      );

      return project;
    } catch (error) {
      this.logger.error('Error creating project', error.stack);
    }
  }

  async deleteProject(projectSlug: string, transaction: Transaction) {
    try {
      const project = await this.getProject(projectSlug);

      await ProjectMember.destroy({
        where: {
          projectId: project.id,
        },
        transaction,
      });
      // await project.destroy({ transaction });
    } catch (error) {
      this.logger.error('Error deleting project', error.stack);
    }
  }
}
