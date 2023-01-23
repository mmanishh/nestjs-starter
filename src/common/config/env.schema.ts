import { Expose, plainToInstance, Type } from "class-transformer";
import { IsInt, IsNotEmpty, validateSync } from "class-validator";

export class EnvironmentVariablesSchema {
  @IsNotEmpty()
  @Expose()
  public CLIENT_URL = 'http://localhost:3000';

  @IsNotEmpty()
  @Expose()
  public COOKIE_SECRET: string;

  @IsNotEmpty()
  @Expose()
  public DATABASE_NAME: string;

  @IsNotEmpty()
  @Expose()
  public DATABASE_HOSTNAME: string;

  @IsNotEmpty()
  @IsInt()
  @Expose()
  @Type(() => Number)
  public DATABASE_PORT: number;

  @IsNotEmpty()
  @Expose()
  public DATABASE_USERNAME: string;

  @IsNotEmpty()
  @Expose()
  public DATABASE_PASSWORD: string;

  @IsInt()
  @Expose()
  @Type(() => Number)
  public PORT = 3000;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(
    EnvironmentVariablesSchema,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
