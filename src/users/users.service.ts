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

  /**
   * Update the completion status of a user's profile.
   * This method updates the username and marks the profile as completed.
   * @param completeProfileDto - DTO containing the user ID and updated profile information.
   * @returns The updated user object.
   * @throws Error if the user is not found or if an error occurs during the update.
   */
  async updateProfileCompletionStatus(
    completeProfileDto: CompleteProfileDto,
  ): Promise<User> {
    try {
      const user = await User.findByPk(completeProfileDto.user.id, {
        attributes: {
          exclude: ['password'],
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await user.update({
        username: completeProfileDto.user.username,
        isProfileCompleted: true,
      });

      return updatedUser;
    } catch (error) {
      throw new Error(
        error.message || 'Failed to update profile completion status',
      );
    }
  }
}
