import path from 'path';
import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface ConnectionOptions extends PostgresConnectionOptions {
  keepConnectionAlive: boolean;
}

export default registerAs(
  'database',
  (): ConnectionOptions => ({
    entities: [path.join(__dirname, '/../../../**/*.entity.{js,ts}')],
    keepConnectionAlive: true,
    logging: false,
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    migrationsRun: true,
    migrationsTableName: 'migrations',
    synchronize: false,
    type: 'postgres',
    url: process.env.DATABASE_URL,
  }),
);
