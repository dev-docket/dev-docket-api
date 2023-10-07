import { Module } from '@nestjs/common';
import { AssignedUsersService } from './assigned-users.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AssignedUsersService],
  exports: [AssignedUsersService],
})
export class AssignedUsersModule {}
