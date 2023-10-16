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

@Controller('api/v1/tasks')
@ApiTags('Tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly assignedUsersService: AssignedUsersService,
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
    const transaction: Transaction = await this.tasksService.startTransaction();

    try {
      const task: Task = await this.tasksService.createTask(
        createTaskDto,
        transaction,
      );
      await this.assignedUsersService.assignUserToTask(
        { userId: createTaskDto.userId, taskId: task.id },
        transaction,
      );

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

  @Patch(':taskId')
  async updateTaskPartial(
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Body() updateTaskPartialDto: UpdateTaskPartialDto,
  ) {
    const transaction: Transaction = await this.tasksService.startTransaction();
    try {
      const updatedTask = await this.tasksService.updateTaskPartial(
        taskId,
        updateTaskPartialDto,
        transaction,
      );

      await transaction.commit();
      return updatedTask;
    } catch (error) {
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

  @Delete(':taskId')
  async deleteTask(
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Res() res: Response,
  ) {
    const transaction: Transaction = await this.tasksService.startTransaction();
    try {
      await this.assignedUsersService.deleteAssignedUsers(taskId, transaction);
      await this.tasksService.deleteTask(taskId, transaction);

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
