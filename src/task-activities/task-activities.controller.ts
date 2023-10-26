import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskActivitiesService } from './task-activities.service';

@Controller('api/v1/tasks')
@ApiTags('Tasks Activity')
export class TaskActivitiesController {
  constructor(private readonly taskActivitiesService: TaskActivitiesService) {}

  @Get(':taskId/activities')
  async getTaskActivities(@Param('taskId', new ParseIntPipe()) taskId: number) {
    return await this.taskActivitiesService.getTaskActivities(taskId);
  }
}
