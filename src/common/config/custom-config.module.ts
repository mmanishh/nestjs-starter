import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CustomConfigService } from './custom-config.service';
import { validate } from './env.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [CustomConfigService],
      useFactory: (configService: CustomConfigService) =>
        ({
          logging: false,
          entities: [path.resolve(`${__dirname}/../../**/**.entity{.ts,.js}`)],
          migrations: [
            path.resolve(
              `${__dirname}/../../../database/migrations/*{.ts,.js}`,
            ),
          ],
          migrationsRun: true,
          migrationsTableName: 'migrations',
          keepConnectionAlive: true,
          synchronize: false,
          type: 'postgres',
          host: configService.DATABASE_HOSTNAME,
          port: configService.DATABASE_PORT,
          username: configService.DATABASE_USERNAME,
          password: configService.DATABASE_PASSWORD,
          database: configService.DATABASE_NAME,
        } as PostgresConnectionOptions),
      dataSourceFactory: async (options) =>
        addTransactionalDataSource(new DataSource(options)).initialize(),
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
