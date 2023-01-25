import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { AppModule } from 'modules/app/app.module';
import * as usersResponse from './mocks/users.json';
import { createDummyUserServiceServer } from './mocks/dummy-user-service-server';

describe('UsersController (integration)', () => {
  let app: INestApplication;
  let dummyUserServiceServerClose: () => void;
  let postgresContainer: StartedTestContainer;
  const databaseConfig = {
    databaseName: 'nestjs-starter-db',
    databaseUsername: 'user',
    databasePassword: 'some-r4ndom-pasS',
    databasePort: 5432,
  }

  beforeAll(async () => {
    const dummyUserServiceServer = await createDummyUserServiceServer();
    dummyUserServiceServerClose = dummyUserServiceServer.close;

    postgresContainer = await new GenericContainer('postgres:15-alpine')
      .withEnvironment({
        POSTGRES_USER: databaseConfig.databaseUsername,
        POSTGRES_PASSWORD: databaseConfig.databasePassword,
        POSTGRES_DB: databaseConfig.databaseName,
      })
      .withExposedPorts(databaseConfig.databasePort)
      .start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string): string => {
          const map: Record<string, string | undefined> = process.env;
          map.USER_SERVICE_URL = dummyUserServiceServer.url;

          map.DATABASE_HOSTNAME = postgresContainer.getHost();
          map.DATABASE_PORT = `${postgresContainer.getMappedPort(databaseConfig.databasePort)}`;
          map.DATABASE_NAME = databaseConfig.databaseName;
          map.DATABASE_USERNAME = databaseConfig.databaseUsername;
          map.DATABASE_PASSWORD = databaseConfig.databasePassword;

          return map[key] || '';
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    dummyUserServiceServerClose();
    await postgresContainer.stop();
  });

  describe('/users (GET)', () => {
    it('should return list of users', async () => {
      return request(app.getHttpServer())
        .get('/users?type=user')
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).toEqual(usersResponse);
        });
    });

    it('should throw an error when type is forbidden', async () => {
      return request(app.getHttpServer())
        .get('/users?type=admin')
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
