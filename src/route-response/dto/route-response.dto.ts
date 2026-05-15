import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateRouteResponseDto {
  @IsDefined()
  @IsUUID()
  routeId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  scenario?: string;

  @IsDefined()
  @IsInt()
  @Min(100)
  @Max(599)
  statusCode: number;

  @IsDefined()
  body: Prisma.InputJsonValue;
}

export class UpdateRouteResponseDto extends PartialType(
  CreateRouteResponseDto,
) {}
