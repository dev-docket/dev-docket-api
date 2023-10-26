import {
  Body,
  Controller,
  Post,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('complete-profile')
  async completeProfile(
    @Body() completeProfileDto: CompleteProfileDto,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.completeProfile(completeProfileDto);

      return res.status(HttpStatus.OK).json({
        message: 'Profile completed successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
