import { ApiProperty } from '@nestjs/swagger';

export class StreamResponseDto {
  @ApiProperty({ description: 'Video stream URL (m3u8 manifest URL)', example: 'https://video.iyf.tv/manifest.m3u8' })
  streamUrl: string;
}

export class GetPlaydataResponseDto {
  @ApiProperty({ description: 'Video manifest URL (m3u8 file)', example: 'https://video.iyf.tv/playlist.m3u8' })
  manifestUrl: string;

  @ApiProperty({ description: 'Media URL', example: 'https://video.iyf.tv/media.m3u8' })
  mediaUrl: string;

  @ApiProperty({ description: 'Response code', example: 200 })
  ret: number;
}
