export interface Drama {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  totalEpisodes: number;
}

export interface Episode {
  episodeId: number;
  episodeKey: string;
  mediaKey: string;
  title: string;
  episodeTitle: string;
  resolutionDes: string;
  isVip: boolean;
}

export interface DramaDetail {
  ret: number;
  data: {
    detailInfo: {
      title: string;
      starring: string;
      introduce: string;
      coverImgUrl: string;
      playCount: number;
      episodes: Episode[];
    };
  };
}

export interface StreamUrl {
  streamUrl: string;
}
