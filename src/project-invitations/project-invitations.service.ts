import { Injectable, Logger } from '@nestjs/common';
import ProjectInvitation from './project-invitation.model';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { nanoid } from 'nanoid';
import { ProjectMembersService } from 'src/project-members/project-members.service';

@Injectable()
export class ProjectInvitationsService {
  private readonly logger = new Logger(ProjectInvitationsService.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectMembersService: ProjectMembersService,
    private readonly usersSerivce: UsersService,
  ) {}

  async getInvitations(projectSlug: string) {
    const project = await this.projectsService.getProject(projectSlug);

    const projectInvitations = await ProjectInvitation.findAll({
      where: {
        projectId: project.id,
      },
    });

    // projectInvitations have userIds, but we want to return the full user objects
    // so we need to fetch the user objects from the database
    const users = await Promise.all(
      projectInvitations.map((projectInvitation) =>
        this.usersSerivce.getUserById(projectInvitation.userId),
      ),
    );

    // We need to return the user objects along with the projectInvitations
    // so we need to map over the projectInvitations and return a new object
    // with the user object included
    return projectInvitations.map((projectInvitation, index) => ({
      ...projectInvitation.toJSON(),
      user: users[index],
    }));
  }

  async getInvitation(projectSlug: string, invitationToken: string) {
    const project = await this.projectsService.getProject(projectSlug);

    const projectInvitation = await ProjectInvitation.findOne({
      where: {
        projectId: project.id,
        token: invitationToken,
      },
    });

    const user = await this.usersSerivce.getUserById(projectInvitation.userId);

    return {
      ...projectInvitation.toJSON(),
      project,
      user,
    };
  }

  async isUserAlreadyInvited(projectId: number, userId: number) {
    const projectInvitation = await ProjectInvitation.findOne({
      where: {
        projectId,
        userId,
      },
    });

    return !!projectInvitation;
  }

  async createInvitation(
    projectSlug: string,
    createInvitationDto: CreateInvitationDto,
  ) {
    try {
      const token = nanoid(16);
      const expiration = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

      const project = await this.projectsService.getProject(projectSlug);

      const user = await this.usersSerivce.getUserByEmail(
        createInvitationDto.email,
      );

      if (user) {
        const isUserAlreadyInvited = await this.isUserAlreadyInvited(
          project.id,
          user.id,
        );

        if (isUserAlreadyInvited) {
          throw new Error('User is already invited to this project');
        }
      }

      const isUserAlreadyMember =
        await this.projectMembersService.isUserAlreadyMember(
          project.id,
          user.id,
        );

      if (isUserAlreadyMember) {
        throw new Error('User is already a member of this project');
      }

      const projectInvitation = await ProjectInvitation.create({
        creatorId: createInvitationDto.creatorId,
        userId: user.id,
        projectId: project.id,
        token,
        expiry: expiration,
      });

      return {
        ...projectInvitation.toJSON(),
        project,
        user,
      };
    } catch (error) {
      this.logger.error('Error creating invitation', error.stack);
    }
  }

  async acceptInvitation(projectSlug: string, invitationToken: string) {
    const transaction = await ProjectInvitation.sequelize.transaction();
    try {
      const project = await this.projectsService.getProject(projectSlug);
      const projectInvitation = await ProjectInvitation.findOne({
        where: {
          projectId: project.id,
          token: invitationToken,
        },
      });
      const user = await this.usersSerivce.getUserById(
        projectInvitation.userId,
      );
      const isUserAlreadyMember =
        await this.projectMembersService.isUserAlreadyMember(
          project.id,
          user.id,
        );
      if (isUserAlreadyMember) {
        throw new Error('User is already a member of this project');
      }
      await this.projectMembersService.createProjectMember({
        userId: user.id,
        projectId: project.id,
        role: 'member',
        transaction,
      });
      await projectInvitation.destroy();

      await transaction.commit();
      return {
        message: 'Invitation accepted',
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error accepting invitation', error.stack);
      throw new Error(error);
    }
  }
}
