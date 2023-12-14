import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssignUserDto } from './dto/assign-user.dto';
import { AssignedUsersService } from './assigned-users.service';
import AssignedUser from './assigned-user.model';
import { TaskActivitiesService } from 'src/task-activities/task-activities.service';

@Controller('api/v1/tasks')
@ApiTags('tasks')
export class AssignedUsersController {
  private readonly logger = new Logger(AssignedUsersController.name);

  constructor(
    private assignedUsersService: AssignedUsersService,
    private taskActivitiesService: TaskActivitiesService,
  ) {}

  @Post(':taskId/assign-user')
  @ApiOperation({ summary: 'Assign user to a task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User assigned successfully',
    type: AssignedUser,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async assignUserToTask(
    @Param('taskId') taskId: number,
    @Body() assignUserDto: AssignUserDto,
  ) {
    const transaction = await AssignedUser.sequelize.transaction();
    try {
      const assignedUser = await this.assignedUsersService.assignUserToTask(
        assignUserDto,
        transaction,
      );
      await transaction.commit();
      return assignedUser;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Delete assigned users from a task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assigned users deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async deleteAssignedUsers(@Param('taskId') taskId: number) {
    const transaction = await AssignedUser.sequelize.transaction();
    try {
      await this.assignedUsersService.deleteAssignedUsers(taskId, transaction);
      // await this.taskActivitiesService.createAutoActivity({
      //   userId: assignUserDto.userId,
      //   taskId,
      //   description: 'deleted assigned users from task',
      //   isAutoActivity: true,
      // });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  }
}
