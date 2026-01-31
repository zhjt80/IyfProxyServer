import { ApiProperty } from '@nestjs/swagger';

export class DramaDto {
  @ApiProperty({ description: 'Drama ID', example: 'yWFaVzMB6wF' })
  id: string;

  @ApiProperty({ description: 'Drama title', example: '大明暗影三百忠魂' })
  title: string;

  @ApiProperty({ description: 'Drama description', example: 'A story about revenge in the shadows' })
  description: string;

  @ApiProperty({ description: 'Drama cover image URL', example: 'https://static.iyf.tv/upload/video/202601301349484988185.gif' })
  imageUrl: string;

  @ApiProperty({ description: 'Total number of episodes', example: 12 })
  totalEpisodes: number;
}

export class DramasResponseDto {
  @ApiProperty({ description: 'Array of dramas', isArray: true, type: [DramaDto] })
  dramas: DramaDto[];
}
