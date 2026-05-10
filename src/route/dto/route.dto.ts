import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { HttpMethod } from '@prisma/client';

export class CreateRouteDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  projectId?: string;

  @IsDefined()
  @IsEnum(HttpMethod)
  method: HttpMethod;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;
}
