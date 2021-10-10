import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig, facebookConfig, googleConfig } from 'modules/auth/config';
import { EventsModule } from 'common/events/events.module';
import { StrategyCallbackMiddleware } from './middlewares';
import { FacebookStrategy } from 'modules/auth/strategies/facebook';
import { GoogleStrategy } from 'modules/auth/strategies/google';
import { UserModule } from 'modules/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy, jwtFactory } from './strategies/jwt';
import { AuthController } from './auth.controller';
import { FacebookAuthMiddleware } from './middlewares/facebook-auth.middleware';
import { GoogleAuthMiddleware } from './middlewares/google-auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig, facebookConfig, googleConfig],
    }),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtFactory),
    EventsModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, FacebookStrategy, GoogleStrategy, AuthService],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class AuthModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FacebookAuthMiddleware)
      .forRoutes('/auth/facebook')
      .apply(StrategyCallbackMiddleware)
      .forRoutes('/auth/facebook/callback')
      .apply(GoogleAuthMiddleware)
      .forRoutes('/auth/google')
      .apply(StrategyCallbackMiddleware)
      .forRoutes('/auth/google/callback');
  }
}
