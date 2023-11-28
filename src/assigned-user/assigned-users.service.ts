import { Injectable } from '@nestjs/common';
import AssignedUser from './assigned-user.model';
import { AssignUserDto } from './dto/assign-user.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class AssignedUsersService {
  async assignUserToTask(
    assignUserDto: AssignUserDto,
    transaction: Transaction,
  ): Promise<AssignedUser> {
    const assignedUser = await AssignedUser.findOne({
      where: { taskId: assignUserDto.taskId },
      transaction,
    });

    if (assignedUser) {
      throw new Error('User already assigned to task');
    }

    return AssignedUser.create({ ...assignUserDto }, { transaction });
  }

  async deleteAssignedUsers(taskId: number, transaction: Transaction) {
    try {
      await AssignedUser.destroy({ where: { taskId }, transaction });
    } catch (error) {
      throw new Error(error);
    }
  }
}
