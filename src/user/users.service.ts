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
}
