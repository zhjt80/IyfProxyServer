import { ApiProperty } from '@nestjs/swagger'

export class EpisodeDto {
  @ApiProperty({ description: 'Episode ID', example: 1207177 })
  episodeId: number

  @ApiProperty({ description: 'Episode key', example: '8nthjJkg0VA' })
  episodeKey: string

  @ApiProperty({ description: 'Media key', example: 'yWFaVzMB6wF' })
  mediaKey: string

  @ApiProperty({ description: 'Episode title', example: '01' })
  title: string

  @ApiProperty({ description: 'Episode title display', example: '第1集' })
  episodeTitle: string

  @ApiProperty({ description: 'Resolution description', example: '576P' })
  resolutionDes: string

  @ApiProperty({ description: 'Is VIP episode', example: false })
  isVip: boolean
}

export class DramaDetailInfoDto {
  @ApiProperty({ description: 'Unique ID', example: 'unique_12345' })
  uniqueID: string

  @ApiProperty({ description: 'Video type', example: 1 })
  videoType: number

  @ApiProperty({ description: 'Video ID', example: 'video_12345' })
  videoId: string

  @ApiProperty({ description: 'Drama title', example: '大明暗影三百忠魂' })
  title: string

  @ApiProperty({ description: 'Starring actors', example: '黄晓明,段晓薇,徐杨,王茂蕾' })
  starring: string

  @ApiProperty({ description: 'Drama introduction', example: '大理寺少主张翼，身负血仇...' })
  introduce: string

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://static.iyf.tv/upload/video/202601301349484988185.gif',
  })
  coverImgUrl: string

  @ApiProperty({ description: 'Play count', example: 31092 })
  playCount: number

  @ApiProperty({ description: 'Array of episodes', type: [EpisodeDto] })
  episodes: EpisodeDto[]
}

export class DramaDetailDataDto {
  @ApiProperty({ description: 'Drama detail information' })
  detailInfo: DramaDetailInfoDto
}

export class DramaDetailResponseDto {
  @ApiProperty({ description: 'Drama detail response' })
  data: DramaDetailDataDto

  @ApiProperty({ description: 'Response code', example: 200 })
  ret: number
}
