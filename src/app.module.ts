import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './user/users.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from './jwt/jwt.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { TasksModule } from './tasks/tasks.module';
import { AssignedUsersModule } from './assigned-user/assigned-users.module';
import { ProjectInvitationsModule } from './project-invitations/project-invitations.module';
import { TasksActivityModule } from './tasks-activity/tasks-activity.module';

@Module({
  imports: [
    JwtModule,
    ProjectsModule,
    TeamsModule,
    ProjectMembersModule,
    TeamMembersModule,
    TasksModule,
    AssignedUsersModule,
    ProjectInvitationsModule,
    TasksActivityModule,
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
