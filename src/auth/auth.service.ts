import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import User from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(createUserDto: LoginUserDto) {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    const payload = { email: user.email, sub: user.id };
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      return {
        user: {
          id: user.id,
          email: user.email,
        },
        access_token: this.jwtService.sign(payload),
      };
    }
    return null;
  }
}
