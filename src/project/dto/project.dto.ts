import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;
}
