import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AssignedUsersModule } from 'src/assigned-user/assigned-users.module';
import { TaskActivitiesService } from 'src/task-activities/task-activities.service';

@Module({
  imports: [AssignedUsersModule],
  controllers: [TasksController],
  providers: [TasksService, TaskActivitiesService],
  exports: [TasksService],
})
export class TasksModule {}
