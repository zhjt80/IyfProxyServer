import { IsString } from 'class-validator';

export class GetStreamDto {
  @IsString()
  episodeKey: string;
}
