import { IsString } from 'class-validator';

export class GetDetailDto {
  @IsString()
  id: string;
}
