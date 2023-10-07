import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Task from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { Transaction } from 'sequelize';
import sequelize from 'src/db/database';
import Team from 'src/teams/team.model';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  async startTransaction(): Promise<Transaction> {
    return await sequelize.transaction();
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    return await Task.findAll({
      where: { userId },
      include: ['task'],
    });
  }

  async getTasksInTeam(teamId: number): Promise<Task[]> {
    return await Task.findAll({ where: { teamId } });
  }

  async getTask(taskId: number): Promise<Task> {
    return await Task.findByPk(taskId);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    transaction: Transaction,
  ): Promise<Task> {
    try {
      // check if the team exists
      const team = await Team.findByPk(createTaskDto.teamId);
      if (!team) {
        throw new HttpException(
          'The team does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await Task.create(
        {
          name: createTaskDto.name,
          status: createTaskDto.status,
          teamId: createTaskDto.teamId,
        },
        { transaction },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
