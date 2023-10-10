import { Injectable } from '@nestjs/common';
import ProjectMember from './project-member.model';
import { ProjectsService } from 'src/projects/projects.service';
import User from 'src/user/user.model';
import { Op } from 'sequelize';
import { GetAllMembersResponseDto } from './dto/get-all-members-response.dto';

@Injectable()
export class ProjectMembersService {
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
}
