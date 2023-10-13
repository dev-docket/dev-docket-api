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
