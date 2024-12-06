import { ProjectsService } from './../projects/projects.service';
import {
  Body,
  Controller,
  Patch,
  HttpException,
  Res,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get('/search')
  async getUsersByUsernameAndProject(
    @Query('username') usernameFragment: string,
    @Query('projectSlug') projectSlug: string,
    @Res() res: Response,
  ) {
    try {
      const users = await this.usersService.getUsersByUsernameAndProject(
        usernameFragment,
        projectSlug,
      );
      if (!users) {
        return res.status(HttpStatus.NOT_FOUND).send('No users found');
      }
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve users: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':userId/projects')
  async getUserProjects(@Param('userId') userId: number, @Res() res: Response) {
    try {
      const projects = await this.projectsService.getUserProjects(userId);
      if (!projects) {
        return res.status(HttpStatus.NOT_FOUND).send('No projects found');
      }
      return res.status(HttpStatus.OK).json(projects);
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve projects: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Update the completion status of a user's profile.
   * @param completeProfileDto - Object containing the ID of the user and the new completion status.
   * @param res - Express Response object.
   * @returns Success message if the profile completion status is updated successfully.
   */
  @Patch('update-completion-status')
  @ApiBody({ type: CompleteProfileDto })
  async updateProfileCompletionStatus(
    @Body() completeProfileDto: CompleteProfileDto,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.updateProfileCompletionStatus(completeProfileDto);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Profile completion status updated successfully' });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
