import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [JwtModule],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
