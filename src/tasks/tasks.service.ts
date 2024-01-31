import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Task from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { Transaction } from 'sequelize';
import Team from 'src/teams/team.model';
import { UpdateTaskPartialDto } from './dto/update-task-partial.dto';
import AssignedUser from 'src/assigned-user/assigned-user.model';
import User from 'src/users/user.model';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

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
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const assignedUser = await AssignedUser.findOne({
      where: { taskId },
      raw: true,
    });

    if (!assignedUser) {
      return task;
    }

    const user = await User.findByPk(assignedUser.userId, {
      raw: true,
      attributes: {
        exclude: ['password'],
      },
    });

    return {
      ...task.get({ plain: true }),
      assignedUser: user,
    };
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

      throw new HttpException(
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTaskPartial(
    taskId: number,
    updateTaskDto: UpdateTaskPartialDto,
    transaction: Transaction,
  ): Promise<
    { updatedTask: Task; oldTask: Task } | { updatedTask: null; oldTask: null }
  > {
    try {
      const task = await Task.findByPk(taskId);

      if (!task) {
        throw new HttpException(
          'The task does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const oldTask = JSON.parse(JSON.stringify(task));

      const definedFields = Object.keys(updateTaskDto)
        .filter((key) => updateTaskDto[key] !== undefined)
        .reduce((obj, key) => {
          obj[key] = updateTaskDto[key];
          return obj;
        }, {} as Partial<UpdateTaskPartialDto>);

      const updatedTask = await task.update(definedFields, { transaction });
      // console.log(oldTask);
      return {
        updatedTask: updatedTask.get({ plain: true }),
        oldTask,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteTask(taskId: number, transaction: Transaction) {
    try {
      await Task.destroy({ where: { id: taskId }, transaction });
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
