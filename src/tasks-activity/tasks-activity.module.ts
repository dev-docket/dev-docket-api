import { Module } from '@nestjs/common';
import { TasksActivityController } from './tasks-activity.controller';
import { TasksActivityService } from './tasks-activity.service';

@Module({
  controllers: [TasksActivityController],
  providers: [TasksActivityService],
  exports: [TasksActivityService],
})
export class TasksActivityModule {}
