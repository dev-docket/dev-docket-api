import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from './jwt/jwt.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { TeamMembersModule } from './team-members/team-members.module';

@Module({
  imports: [
    JwtModule,
    ProjectsModule,
    TeamsModule,
    ProjectMembersModule,
    TeamMembersModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
