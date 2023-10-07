import { Injectable } from '@nestjs/common';
import ProjectMember from './project-member.model';

@Injectable()
export class ProjectMembersService {
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
