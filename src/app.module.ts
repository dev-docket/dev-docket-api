import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from './jwt/jwt.module';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsModule } from './projects/projects.module';
import { ProjectMembersController } from './project-members/project-members.controller';
import { ProjectMembersService } from './project-members/project-members.service';
import { ProjectsService } from './projects/projects.service';

@Module({
  imports: [JwtModule, ProjectsModule],
  controllers: [
    AppController,
    UserController,
    AuthController,
    ProjectsController,
    ProjectMembersController,
  ],
  providers: [AppService, AuthService, ProjectMembersService, ProjectsService],
})
export class AppModule {}
