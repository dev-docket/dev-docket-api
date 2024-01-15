import { Injectable } from '@nestjs/common';
import AssignedUser from './assigned-user.model';
import { AssignUserDto } from './dto/assign-user.dto';
import { Transaction } from 'sequelize';
import User from 'src/users/user.model';

@Injectable()
export class AssignedUsersService {
  async assignUserToTask(
    assignUserDto: AssignUserDto,
    transaction: Transaction,
  ): Promise<any> {
    const assignedUser = await AssignedUser.findOne({
      where: { taskId: assignUserDto.taskId },
      transaction,
    });

    if (assignedUser) {
      throw new Error('User already assigned to task');
    }

    await AssignedUser.create({ ...assignUserDto }, { transaction });
    const user = await User.findByPk(assignUserDto.userId, {
      raw: true,
      attributes: {
        exclude: ['password'],
      },
    });

    return {
      ...assignUserDto,
      user,
    };
  }

  async deleteAssignedUsers(taskId: number, transaction: Transaction) {
    try {
      await AssignedUser.destroy({ where: { taskId }, transaction });
    } catch (error) {
      throw new Error(error);
    }
  }
}
