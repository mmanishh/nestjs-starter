import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, validateSync } from 'class-validator';

export class EnvironmentVariablesSchema {
  @Expose()
  public CLIENT_URL = 'http://localhost:3000';

  @Expose()
  public COOKIE_SECRET = 'secret';

  @Expose()
  @IsNotEmpty()
  public DATABASE_NAME: string;

  @Expose()
  @IsNotEmpty()
  public DATABASE_HOSTNAME: string;

  @Expose()
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  public DATABASE_PORT: number;

  @Expose()
  @IsNotEmpty()
  public DATABASE_USERNAME: string;

  @Expose()
  @IsNotEmpty()
  public DATABASE_PASSWORD: string;

  @Expose()
  @Type(() => Number)
  public PORT = 3000;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariablesSchema, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
