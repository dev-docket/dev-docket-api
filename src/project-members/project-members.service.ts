import { Injectable, Logger } from '@nestjs/common';
import ProjectMember from './project-member.model';
import { ProjectsService } from 'src/projects/projects.service';
import User from 'src/user/user.model';
import { Op } from 'sequelize';
import { GetAllMembersResponseDto } from './dto/get-all-members-response.dto';

@Injectable()
export class ProjectMembersService {
  private readonly logger = new Logger(ProjectMembersService.name);

  constructor(private readonly projectService: ProjectsService) {}

  async getAllMembers(
    projectSlug: string,
  ): Promise<GetAllMembersResponseDto[]> {
    const project = await this.projectService.getProject(projectSlug);

    const projectMembers = await ProjectMember.findAll({
      where: {
        projectId: project.id,
      },
    });

    const userIds = projectMembers.map((projectMember) => projectMember.userId);

    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: userIds,
        },
      },
    });

    const projectMemberDto = projectMembers.map((projectMember) => {
      const user = users.find((user) => user.id === projectMember.userId);
      return {
        ...projectMember.toJSON(),
        user,
      };
    });

    return projectMemberDto;
  }

  async isUserAlreadyMember(projectId: number, userId: number) {
    const projectMember = await ProjectMember.findOne({
      where: {
        projectId,
        userId,
      },
    });

    return !!projectMember;
  }

  async createProjectMember(
    userId: number,
    projectId: number,
    role: 'owner' | 'member',
  ) {
    await ProjectMember.create({
      userId,
      projectId,
      role,
    });
  }

  async removeMember(projectSlug: string, userId: number) {
    try {
      const project = await this.projectService.getProject(projectSlug);

      // check if the user is the owner of the project
      // if so, throw an error
      const projectMember = await ProjectMember.findOne({
        where: {
          projectId: project.id,
          userId,
        },
      });

      if (projectMember.role === 'owner') {
        throw new Error('Cannot remove the owner of the project');
      }

      await projectMember.destroy();
    } catch (error) {
      this.logger.error('Error removing member', error.stack);
      throw new Error(error);
    }
  }
}
