import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import Task from './task.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTasksInTeamResponse } from './dto/get-tasks-in-team-response.dto';
import { Transaction } from 'sequelize';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignedUsersService } from 'src/assigned-user/assigned-users.service';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly assignedUsersService: AssignedUsersService,
  ) {}

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

  @Get(':taskId')
  async getTask(
    @Param('taskId', new ParseIntPipe()) taskId: number,
  ): Promise<Task> {
    return await this.tasksService.getTask(taskId);
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
}
