import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticate } from 'passport';
import { getPassportOptions } from './utils';

export class FacebookAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(): Promise<void> {
    return authenticate('facebook', getPassportOptions.call(this));
  }
}
