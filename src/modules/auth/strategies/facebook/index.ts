import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('facebook.clientID'),
      clientSecret: configService.get('facebook.clientSecret'),
      fbGraphVersion: configService.get('facebook.fbGraphVersion'),
      callbackURL: configService.get('facebook.callbackURL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const user = await this.userService.findOrCreate(profile);

    done(null, user);
  }
}
