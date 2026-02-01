export interface Video {
  id: string
  title: string
  description: string
  imageUrl: string
  totalEpisodes: number
  playCount?: number
  isHot?: boolean
  lang?: string
  regional?: string
  actor?: string
  cidMapper?: string
  mediaType?: string
}

export interface Episode {
  episodeId: number
  episodeKey: string
  mediaKey: string
  title: string
  episodeTitle: string
  resolutionDes: string
  videoType: number
  isVip: boolean
}

export interface DramaDetail {
  ret: number
  data: {
    detailInfo: {
      uniqueID: string
      videoId: string
      title: string
      starring: string
      introduce: string
      coverImgUrl: string
      playCount: number
      episodes: Episode[]
    }
  }
}

