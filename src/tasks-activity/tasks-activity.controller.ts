import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TasksActivityService } from './tasks-activity.service';

@Controller('api/v1/tasks')
@ApiTags('Tasks Activity')
export class TasksActivityController {
  constructor(private readonly tasksActivityService: TasksActivityService) {}

  @Get(':taskId/activities')
  async getTaskActivitys(@Param('taskId', new ParseIntPipe()) taskId: number) {
    return await this.tasksActivityService.getTaskActivitys(taskId);
  }
}
