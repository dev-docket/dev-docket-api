import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { TeamMembersModule } from 'src/team-members/team-members.module';

@Module({
  imports: [ProjectsModule, TeamMembersModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
