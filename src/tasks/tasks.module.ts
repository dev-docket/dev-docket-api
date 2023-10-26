import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AssignedUsersModule } from 'src/assigned-user/assigned-users.module';
import { TasksActivityService } from 'src/tasks-activity/tasks-activity.service';

@Module({
  imports: [AssignedUsersModule],
  controllers: [TasksController],
  providers: [TasksService, TasksActivityService],
  exports: [TasksService],
})
export class TasksModule {}
