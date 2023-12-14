import { Injectable } from '@nestjs/common';
import TaskActivity from './task-activities.model';
import { Transaction } from 'sequelize';
import User from 'src/users/user.model';
import { DateTime } from 'luxon';

@Injectable()
export class TaskActivitiesService {
  getCurrentTimeInIso8601() {
    const currentTime = DateTime.now();
    return currentTime.toISO();
  }

  async getTaskActivities(taskId: number) {
    const activities = await TaskActivity.findAll({
      where: { taskId },
      order: [['createdAt', 'ASC']],
    });

    // each activity has a user id. return whole user object
    const activitiesWithUsers = await Promise.all(
      activities.map(async (activity) => {
        const user = await User.findByPk(activity.userId, {
          attributes: {
            exclude: ['password'],
          },
        });
        return {
          ...activity.get({ plain: true }),
          user,
        };
      }),
    );
    return activitiesWithUsers;
  }

  async createAutoActivity({
    userId,
    taskId,
    description,
    isAutoActivity = false,
    transaction,
  }: {
    userId: number;
    taskId: number;
    description: string;
    isAutoActivity?: boolean;
    transaction: Transaction;
  }) {
    const createdAt = this.getCurrentTimeInIso8601();

    const activity = await TaskActivity.create(
      {
        userId,
        taskId,
        description,
        createdAt,
        isAutoActivity,
      },
      {
        transaction,
      },
    );

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });

    return {
      ...activity.get({ plain: true }),
      user,
    };
  }

  async createChangedNameActivity(
    userId: number,
    taskId: number,
    transaction: Transaction,
  ) {
    const createdAt = this.getCurrentTimeInIso8601();

    const activity = await TaskActivity.create(
      {
        userId,
        taskId,
        description: 'updated the name',
        createdAt,
        isAutoActivity: true,
      },
      {
        transaction,
      },
    );

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });

    return {
      ...activity.get({ plain: true }),
      user,
    };
  }

  async createDescriptionActivity(
    userId: number,
    taskId: number,
    transaction: Transaction,
  ) {
    const createdAt = this.getCurrentTimeInIso8601();

    const activity = await TaskActivity.create(
      {
        userId,
        taskId,
        description: 'updated the description',
        createdAt,
        isAutoActivity: true,
      },
      {
        transaction,
      },
    );

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });

    return {
      ...activity.get({ plain: true }),
      user,
    };
  }

  async createActivityLog(
    userId: number,
    taskId: number,
    oldStatus: string | number,
    newStatus: string,
    transaction: Transaction,
  ) {
    const description = `task status changed from ${oldStatus} to ${newStatus}`;

    const activity = await this.createAutoActivity({
      userId,
      taskId,
      description,
      transaction,
    });

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });

    return {
      ...activity,
      user,
    };
  }

  async deleteAllTaskActivities(taskId: number, transaction: Transaction) {
    await TaskActivity.destroy({
      where: { taskId },
      transaction,
    });
  }
}
