import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwt: JwtService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.username, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  // ⬇️ change this method to redirect to React with the token
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Req() req: any, @Res() res: any) {
    const token = this.jwt.sign(
      { sub: `gh:${req.user.id}` },
      { expiresIn: '1h' },
    );
    const target = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');
    // send token as a query param (you can switch to hash if you prefer)
    target.searchParams.set('token', token);
    return res.redirect(target.toString());
  }
}
