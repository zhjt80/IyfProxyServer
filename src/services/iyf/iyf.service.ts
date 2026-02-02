import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { AppLoggerService } from '../logger.service'
import { Video, DramaDetail } from '../../types'
const { generateVVWithResult, generatePub } = require('../utils/generateVV.js')

const BASE_URL = 'https://www.iyf.tv'
const API_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
}
const REQUEST_TIMEOUT = 15000

@Injectable()
export class IyfService {
  private readonly logger = new AppLoggerService()
  private readonly baseUrl = BASE_URL

  private async makeApiRequest(url: string, params?: any): Promise<any> {
    this.logger.log(`Making API request to: ${url}`)
    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT,
      headers: API_HEADERS,
      params,
    })
    return response.data
  }

  async fetchMovies(filter?:string): Promise<Video[]> {
    this.logger.log('Fetching movies from iyf.tv API')
    try {
      const pub = generatePub()
      const generatedDeviceId = this.generateDeviceId()

      const apiUrl =
        `https://api.iyf.tv/api/list/getconditionfilterdata?titleid=movie&ids=${filter}&page=1&size=21&System=h5&AppVersion=1.0&SystemVersion=h5&version=H3&DeviceId=${generatedDeviceId}&i18n=0&pub=${pub}`

      const response = await this.makeApiRequest(apiUrl)

      const movies = this.parseApiVideoList(response)
      this.logger.log(`Fetched ${movies.length} movies from API`)

      if (movies.length === 0) {
        this.logger.warn('No movies from API, using mock data')
        return this.getMockMovies()
      }

      return movies
    } catch (error) {
      this.logger.error('Failed to fetch movies from API, using mock data', error.stack, 'IyfService')
      return this.getMockMovies()
    }
  }

  async fetchDramas(filter?:string): Promise<Video[]> {
    this.logger.log('Fetching dramas from iyf.tv API')
    try {

      const pub = generatePub()
      const generatedDeviceId = this.generateDeviceId()
      const apiUrl =`https://api.iyf.tv/api/list/getconditionfilterdata?titleid=drama&ids=${filter}&page=1&size=21&System=h5&AppVersion=1.0&SystemVersion=h5&version=H3&DeviceId=${generatedDeviceId}&i18n=0&pub=${pub}`
      const response = await this.makeApiRequest(apiUrl)

      const dramas = this.parseApiVideoList(response)
      this.logger.log(`Fetched ${dramas.length} dramas from API`)

      if (dramas.length === 0) {
        this.logger.warn('No dramas from API, using mock data')
        return this.getMockDramas()
      }

      return dramas
    } catch (error) {
      this.logger.error('Failed to fetch dramas from API, using mock data', error.stack, 'IyfService')
      return this.getMockDramas()
    }
  }

  async fetchDramaDetail(mediaKey: string): Promise<DramaDetail> {
    this.logger.log(`Fetching drama detail for mediaKey: ${mediaKey}`)
    try {
      const apiUrl = 'https://api.iyf.tv/api/video/videodetails'
      const pub = generatePub()

      const baseParams = {
        mediaKey,
        System: 'h5',
        AppVersion: '1.0',
        SystemVersion: 'h5',
        version: 'H3',
        i18n: '0',
        pub,
      }

      const vvResult = generateVVWithResult(baseParams, { url: '', pub })
      const params = { ...baseParams, vv: vvResult.vv }

      this.logger.log(`Fetching from iyf.tv API with generated pub:${pub} and vv:${vvResult.vv}`)

      const response = await this.makeApiRequest(apiUrl, params)
      const detail = this.parseApiDramaDetail(response)
      this.logger.log(`Fetched detail for drama: ${detail.data.detailInfo.title}`)
      return detail
    } catch (error) {
      this.logger.error(`Failed to fetch drama detail for mediaKey: ${mediaKey}, using mock data`, error.stack, 'IyfService')
      return this.getMockDramaDetail(mediaKey)
    }
  }

  async fetchPlaydata(mediaKey: string, videoId: string, videoType: string): Promise<any> {
    this.logger.log(`Fetching playdata for mediaKey: ${mediaKey}, videoId: ${videoId}`)
    try {
      const apiUrl = 'https://api.iyf.tv/api/video/getplaydata'
      const generatedPub = generatePub()
      const generatedDeviceId = this.generateDeviceId()

      const baseParams: any = {
        mediaKey,
        videoId,
        videoType,
        Liveline: '',
        System: 'h5',
        AppVersion: '1.0',
        SystemVersion: 'h5',
        version: 'H3',
        DeviceId: generatedDeviceId,
        i18n: '0',
        pub: generatedPub,
      }

      const vvResult = generateVVWithResult(baseParams, { url: '', pub: generatedPub })
      const params = { ...baseParams, vv: vvResult.vv }

      this.logger.log(`Fetching from iyf.tv API with pub:${generatedPub}, DeviceId:${generatedDeviceId}, vv:${vvResult.vv}`)

      const response = await this.makeApiRequest(apiUrl, params)
      const responseData = response.data

      if (responseData.list && Array.isArray(responseData.list)) {
        const item = responseData.list.find(
          (item: any) => item.mediaUrl && item.mediaUrl !== null && item.mediaUrl !== '',
        )

        if (!item) {
          this.logger.warn('No item with valid mediaUrl found')
          throw new Error('No playdata with valid mediaUrl available')
        }

        this.logger.log(`Returning playdata item with mediaUrl: ${item.mediaUrl}`)
        return item
      }

      this.logger.warn('No playdata list found in response')
      throw new Error('No playdata available')
    } catch (error) {
      this.logger.error(`Failed to fetch playdata for mediaKey: ${mediaKey}, videoId: ${videoId}`, error.stack, 'IyfService')
      throw error
    }
  }

  private generateDeviceId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private parseApiVideoList(apiResponse: any): Video[] {
    const movies: Video[] = []

    try {
      if (apiResponse.ret === 200 && apiResponse.data) {
        const result = apiResponse.data.result || apiResponse.data.list || []

        result.forEach((item: any) => {
          if (item.mediaKey && item.title) {
            movies.push({
              id: item.mediaKey || '',
              title: item.title || '',
              description: item.description || 'No description available',
              imageUrl: item.coverImgUrl || '',
              totalEpisodes: item.isSerial ? parseInt(item.lastName) || 0 : 0,
              playCount: parseInt(item.playCount) || 0,
              isHot: item.isHot || false,
              lang: item.lang || '',
              regional: item.regional || '',
              actor: item.actor || '',
              cidMapper: item.cidMapper || '',
              mediaType: item.mediaType || '',
              score: item.score || 0,
            })
          }
        })
      }
    } catch (error) {
      this.logger.error('Error parsing movie API response', error.stack, 'IyfService')
    }

    return movies
  }


  private parseApiDramaDetail(apiResponse: any): DramaDetail {
    const data = apiResponse
    const detailInfo = data.data?.detailInfo || {}

    const uniqueID = detailInfo.uniqueID || detailInfo.uniqueid || ''
    const videoId = detailInfo.videoId || detailInfo.videoid || ''
    const title = detailInfo.title || detailInfo.videoName || ''
    const starring = detailInfo.actors || detailInfo.starring || 'Unknown'
    const introduce = detailInfo.introduce || detailInfo.description || 'No description available'
    const coverImgUrl = detailInfo.coverImgUrl || detailInfo.img || detailInfo.image || detailInfo.cover || ''
    const playCount = parseInt(detailInfo.playCount) || 0

    const episodes: any[] = []
    if (Array.isArray(detailInfo.episodes) && detailInfo.episodes.length > 0) {
      detailInfo.episodes.forEach((episode: any) => {
        episodes.push({
          episodeId: episode.episodeId || 0,
          episodeKey: episode.episodeKey || '',
          mediaKey: episode.mediaKey || '',
          title: '',
          episodeTitle: episode.episodeTitle || episode.title || `第${episodes.length + 1}集`,
          resolutionDes: episode.resolutionDes || 'HD',
          videoType: episode.videoType || 0,
          isVip: episode.isVip || false,
        })
      })
    }

    return {
      ret: data.ret || 0,
      data: {
        detailInfo: {
          uniqueID,
          videoId,
          title,
          starring,
          introduce,
          coverImgUrl,
          playCount,
          episodes,
        },
      },
    }
  }

  private getMockDramas(): Video[] {
    return [
      {
        id: 'drama-1',
        title: '三体',
        description: '根据刘慈欣同名小说改编的科幻剧',
        imageUrl: 'https://via.placeholder.com/300x450/4A90E2/ffffff?text=三体',
        totalEpisodes: 30,
      },
      {
        id: 'drama-2',
        title: '繁花',
        description: '王家卫导演的年代剧',
        imageUrl: 'https://via.placeholder.com/300x450/E94B3C/ffffff?text=繁花',
        totalEpisodes: 30,
      },
      {
        id: 'drama-3',
        title: '庆余年',
        description: '穿越架空历史剧',
        imageUrl: 'https://via.placeholder.com/300x450/6C5CE7/ffffff?text=庆余年',
        totalEpisodes: 46,
      },
      {
        id: 'drama-4',
        title: '琅琊榜',
        description: '古装权谋剧',
        imageUrl: 'https://via.placeholder.com/300x450/00CEC9/ffffff?text=琅琊榜',
        totalEpisodes: 54,
      },
    ]
  }

  private getMockMovies(): Video[] {
    return [
      {
        id: 'movie-1',
        title: '复仇者联盟',
        description: '超级英雄集结',
        imageUrl: 'https://via.placeholder.com/300x450/E94B3C/ffffff?text=复仇者联盟',
        totalEpisodes: 0,
      },
      {
        id: 'movie-2',
        title: '星际穿越',
        description: '科幻巨制',
        imageUrl: 'https://via.placeholder.com/300x450/6C5CE7/ffffff?text=星际穿越',
        totalEpisodes: 0,
      },
      {
        id: 'movie-3',
        title: '流浪地球',
        description: '中国科幻电影里程碑',
        imageUrl: 'https://via.placeholder.com/300x450/00CEC9/ffffff?text=流浪地球',
        totalEpisodes: 0,
      },
      {
        id: 'movie-4',
        title: '哪吒之魔童降世',
        description: '国产动画电影',
        imageUrl: 'https://via.placeholder.com/300x450/FDCB6E/ffffff?text=哪吒之魔童降世',
        totalEpisodes: 0,
      },
    ]
  }

  private getMockDramaDetail(id: string): DramaDetail {
    const mockDetail = {
      uniqueID: 'mock_unique_id',
      videoId: `video_${id}`,
      title: '电视剧',
      starring: '待定',
      introduce: '暂无介绍',
      coverImgUrl: 'https://via.placeholder.com/300x450/95A5A6/ffffff?text=电视剧',
      playCount: 123456,
      videoType: 1,
    }

    const episodes = Array.from({ length: 5 }, (_, i) => ({
      episodeId: i + 1,
      episodeKey: `${id}-episode-${i + 1}`,
      mediaKey: `media-${id}`,
      title: '',
      episodeTitle: `第${i + 1}集`,
      resolutionDes: 'HD',
      videoType: 1,
      isVip: false,
    }))

    return {
      ret: 0,
      data: {
        detailInfo: {
          ...mockDetail,
          episodes,
        },
      },
    }
  }
}
