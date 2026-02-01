import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  @ApiProperty({ description: 'Video ID', example: 'yWFaVzMB6wF' })
  id: string;
  
  @ApiProperty({ description: 'Video title', example: '大明暗影三百忠魂' })
  title: string;
  
  @ApiProperty({ description: 'Video description', example: 'A story about revenge in the shadows' })
  description: string;
  
  @ApiProperty({ description: 'Video cover image URL', example: 'https://static.iyf.tv/upload/video/202601301349484988185.gif' })
  imageUrl: string;
  
  @ApiProperty({ description: 'Total number of episodes', example: 12 })
  totalEpisodes: number;
  
  @ApiProperty({ description: 'Number of views', example: 230295 })
  playCount?: number;
  
  @ApiProperty({ description: 'Is hot trending', example: true })
  isHot?: boolean;
  
  @ApiProperty({ description: 'Language', example: '国语' })
  lang?: string;
  
  @ApiProperty({ description: 'Region', example: '大陆' })
  regional?: string;
  
  @ApiProperty({ description: 'Actor names', example: '陈坤,王砚辉' })
  actor?: string;
  
  @ApiProperty({ description: 'Category', example: '剧情' })
  cidMapper?: string;
  
  @ApiProperty({ description: 'Media type', example: '电视剧' })
  mediaType?: string;
}

export class VideosResponseDto {
  @ApiProperty({ description: 'Array of videos', isArray: true, type: [VideoDto] })
  dramas: VideoDto[];
}
