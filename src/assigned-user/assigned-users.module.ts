import { Module } from '@nestjs/common';
import { AssignedUsersService } from './assigned-users.service';
import { AssignedUsersController } from './assigned-users-controller';

@Module({
  imports: [],
  controllers: [AssignedUsersController],
  providers: [AssignedUsersService],
  exports: [AssignedUsersService],
})
export class AssignedUsersModule {}
