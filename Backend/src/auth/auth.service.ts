import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // demo store; swap for a DB in real life
  private users = new Map<string, string>(); // username -> passwordHash

  constructor(private jwt: JwtService) {}

  async register(username: string, password: string) {
    if (this.users.has(username)) throw new ConflictException('User exists');
    const hash = await bcrypt.hash(password, 10);
    this.users.set(username, hash);
    return { message: 'Registered' };
  }

  async login(username: string, password: string) {
    const saved = this.users.get(username);
    if (!saved) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, saved);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync(
      { sub: username },
      { expiresIn: '1h' },
    );
    return { token };
  }
}
