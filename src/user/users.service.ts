import { Injectable } from '@nestjs/common';
import User from './user.model';

@Injectable()
export class UsersService {
  async getUserById(id: number) {
    return await User.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });
  }

  async getUserByEmail(email: string) {
    try {
      return await User.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ['password'],
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
