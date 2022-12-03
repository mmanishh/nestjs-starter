import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { Subject } from 'rxjs';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import config from 'common/config';
import databaseConfig from 'common/config/database';
import { loggerConfig } from 'common/config/logger';
import { EventsModule } from 'common/events/events.module';
import { UsersModule } from 'modules/users/users.module';
import { AppController } from './app.controller';

const typeOrmConfig = {
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    configService.get('database'),
  dataSourceFactory: async (options) =>
    addTransactionalDataSource(new DataSource(options)).initialize(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    WinstonModule.forRoot(loggerConfig),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    EventsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'configService',
      useFactory: () => new ConfigService(),
    },
  ],
})
export class AppModule implements OnApplicationShutdown {
  private readonly logger = new Logger(AppModule.name);
  private readonly shutdownListener$: Subject<void> = new Subject();

  onApplicationShutdown = async (signal: string): Promise<void> => {
    if (!signal) return;
    this.logger.log(`Detected signal: ${signal}`);

    this.shutdownListener$.next();
  };

  subscribeToShutdown = (shutdownFn: () => void): void => {
    this.shutdownListener$.subscribe(() => {
      this.logger.log('App is closed');
      shutdownFn();
    });
  };
}
