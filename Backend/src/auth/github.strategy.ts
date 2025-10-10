import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['read:user', 'user:email'],
    });
  }

  // Whatever you return here becomes req.user in the controller after AuthGuard('github')
  validate(_accessToken: string, _refreshToken: string, profile: any) {
    // profile.id and profile.username are the important bits
    return {
      id: profile.id,
      username: profile.username,
      emails: profile.emails?.map((e: any) => e.value) ?? [],
      avatarUrl: profile.photos?.[0]?.value ?? null,
      provider: 'github',
    };
  }
}
