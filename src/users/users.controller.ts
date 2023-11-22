import {
  Body,
  Controller,
  Patch,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Update the completion status of a user's profile.
   * @param completeProfileDto - Object containing the ID of the user and the new completion status.
   * @param res - Express Response object.
   * @returns Success message if the profile completion status is updated successfully.
   */
  @Patch('update-completion-status')
  @ApiBody({ type: CompleteProfileDto })
  async updateProfileCompletionStatus(
    @Body() completeProfileDto: CompleteProfileDto,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.updateProfileCompletionStatus(completeProfileDto);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Profile completion status updated successfully' });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
