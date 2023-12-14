import { Module } from '@nestjs/common';
import { AssignedUsersService } from './assigned-users.service';
import { AssignedUsersController } from './assigned-users-controller';
import { TaskActivitiesService } from 'src/task-activities/task-activities.service';

@Module({
  imports: [],
  controllers: [AssignedUsersController],
  providers: [AssignedUsersService, TaskActivitiesService],
  exports: [AssignedUsersService],
})
export class AssignedUsersModule {}
