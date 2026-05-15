import { PartialType } from '@nestjs/mapped-types';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
