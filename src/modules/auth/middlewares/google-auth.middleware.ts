import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticate } from 'passport';
import { getPassportOptions } from './utils';

export class GoogleAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(): Promise<void> {
    return authenticate('google', getPassportOptions.call(this));
  }
}
