import { Injectable } from '@nestjs/common';
import User from './user.model';
import { CompleteProfileDto } from './dto/complete-profile.dto';

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

  async completeProfile(userCompleteProfile: CompleteProfileDto) {
    try {
      const user = await User.findByPk(userCompleteProfile.user.id, {
        attributes: {
          exclude: ['password'],
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await user.update({
        username: userCompleteProfile.user.username,
        isProfileCompleted: true,
      });

      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }
}
