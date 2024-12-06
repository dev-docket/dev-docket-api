import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { TaskActivitiesModule } from './task-activities/task-activities.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule,
    ProjectsModule,
    TeamsModule,
    ProjectMembersModule,
    TeamMembersModule,
    TasksModule,
    AssignedUsersModule,
    ProjectInvitationsModule,
    TaskActivitiesModule,
    UsersModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
