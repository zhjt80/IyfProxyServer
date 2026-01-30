import { IsOptional, IsString } from 'class-validator';

export class GetDramasDto {
  @IsOptional()
  @IsString()
  region?: string;
}
