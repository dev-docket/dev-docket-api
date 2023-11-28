import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import Task from './task.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTasksInTeamResponse } from './dto/get-tasks-in-team-response.dto';
import { Transaction } from 'sequelize';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignedUsersService } from 'src/assigned-user/assigned-users.service';
import { UpdateTaskPartialDto } from './dto/update-task-partial.dto';
import { Response } from 'express';
import { TaskActivitiesService } from 'src/task-activities/task-activities.service';
import sequelize from 'src/db/database';
import AssignedUser from 'src/assigned-user/assigned-user.model';
import { AssignUserDto } from './dto/assign-user.dto';

@Controller('api/v1/tasks')
@ApiTags('Tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly assignedUsersService: AssignedUsersService,
    private readonly taskActivitiesService: TaskActivitiesService,
  ) {}

  @Get(':taskId')
  async getTask(
    @Param('taskId', new ParseIntPipe()) taskId: number,
  ): Promise<Task> {
    return await this.tasksService.getTask(taskId);
  }

  @Get('users/:userId')
  async getUserTasks(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<Task[]> {
    return await this.tasksService.getUserTasks(userId);
  }

  @Get('teams/:teamId')
  @ApiOperation({ summary: 'Get tasks of a specific user' })
  @ApiResponse({
    status: 200,
    description: 'The tasks have been successfully retrieved.',
    type: [GetTasksInTeamResponse],
  })
  async getTasksInTeam(
    @Param('teamId', new ParseIntPipe()) teamId: number,
  ): Promise<Task[]> {
    return await this.tasksService.getTasksInTeam(teamId);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const task: Task = await this.tasksService.createTask(
        createTaskDto,
        transaction,
      );
      // await this.assignedUsersService.assignUserToTask(
      //   { userId: createTaskDto.userId, taskId: task.id },
      //   transaction,
      // );

      await this.taskActivitiesService.createAutoActivity({
        userId: createTaskDto.userId,
        taskId: task.id,
        description: 'Task created',
        transaction,
        isAutoActivity: true,
      });

      await transaction.commit();
      return task;
    } catch (error) {
      this.logger.error(error);

      await transaction.rollback();

      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('assign')
  async assignUserToTask(
    @Body() assignUserDto: AssignUserDto,
    @Res() res: Response,
  ) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const assignedUser: AssignedUser =
        await this.assignedUsersService.assignUserToTask(
          assignUserDto,
          transaction,
        );

      await this.taskActivitiesService.createAutoActivity({
        userId: assignUserDto.userId,
        taskId: assignUserDto.taskId,
        description: 'Task assigned',
        transaction,
        isAutoActivity: true,
      });

      await transaction.commit();

      res.status(HttpStatus.CREATED).send(assignedUser);
    } catch (error) {
      this.logger.error(error);

      await transaction.rollback();

      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':taskId')
  async updateTaskPartial(
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Body() updateTaskPartialDto: UpdateTaskPartialDto,
    @Res() res: Response,
  ) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { updatedTask, oldTask } =
        await this.tasksService.updateTaskPartial(
          taskId,
          updateTaskPartialDto,
          transaction,
        );

      const activities =
        await this.taskActivitiesService.getTaskActivities(taskId);

      if (updateTaskPartialDto.name) {
        activities.push(
          await this.taskActivitiesService.createChangedNameActivity(
            updateTaskPartialDto.userId,
            updateTaskPartialDto.id,
            transaction,
          ),
        );
      }

      if (updateTaskPartialDto.description) {
        activities.push(
          await this.taskActivitiesService.createDescriptionActivity(
            updateTaskPartialDto.userId,
            updateTaskPartialDto.id,
            transaction,
          ),
        );
      }

      if (updateTaskPartialDto.status) {
        activities.push(
          await this.taskActivitiesService.createActivityLog(
            updateTaskPartialDto.userId,
            updateTaskPartialDto.id,
            oldTask.status,
            updateTaskPartialDto.status,
            transaction,
          ),
        );
      }

      await transaction.commit();

      res.status(HttpStatus.OK).send({ ...updatedTask, activities });
    } catch (error) {
      await transaction.rollback();

      this.logger.error(error);

      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':taskId')
  async deleteTask(
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Res() res: Response,
  ) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      await this.assignedUsersService.deleteAssignedUsers(taskId, transaction);
      await this.tasksService.deleteTask(taskId, transaction);

      await this.taskActivitiesService.deleteAllTaskActivities(
        taskId,
        transaction,
      );
      await transaction.commit();

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      if (transaction) await transaction.rollback();

      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.response || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
