import { Injectable } from '@nestjs/common';
import ProjectMember from 'src/project-members/project-member.model';
import Project from './project.model';
import { Op } from 'sequelize';

@Injectable()
export class ProjectsService {
  async getUserProjects(userId: number) {
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
  }
}
