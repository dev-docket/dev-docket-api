import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from './jwt/jwt.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectMembersController } from './project-members/project-members.controller';
import { ProjectMembersService } from './project-members/project-members.service';
import { TeamsController } from './teams/teams.controller';

@Module({
  imports: [JwtModule, ProjectsModule],
  controllers: [
    AppController,
    UserController,
    AuthController,
    ProjectMembersController,
    TeamsController,
  ],
  providers: [AppService, AuthService, ProjectMembersService],
})
export class AppModule {}
