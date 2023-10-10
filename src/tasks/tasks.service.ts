import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Task from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { Transaction } from 'sequelize';
import sequelize from 'src/db/database';
import Team from 'src/teams/team.model';
import { UpdateTaskPartialDto } from './dto/update-task-partial.dto';

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

  async updateTaskPartial(
    taskId: number,
    updateTaskDto: UpdateTaskPartialDto,
    transaction: Transaction,
  ): Promise<Task> {
    try {
      const task = await Task.findByPk(taskId);
      if (!task) {
        throw new HttpException(
          'The task does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const definedFields = Object.keys(updateTaskDto)
        .filter((key) => updateTaskDto[key] !== undefined)
        .reduce((obj, key) => {
          obj[key] = updateTaskDto[key];
          return obj;
        }, {} as Partial<UpdateTaskPartialDto>);
      // delete definedFields.id; // Remove id field as it should not be updated

      console.log(definedFields);

      return await task.update(definedFields, { transaction });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
