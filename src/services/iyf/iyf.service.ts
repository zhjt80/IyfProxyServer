import { Injectable, InternalServerErrorException } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { ConfigService } from '@nestjs/config'
import { AppLoggerService } from '../logger.service'
import { Drama, DramaDetail, StreamUrl } from '../../types'
const { generateVVWithResult, generatePub } = require('../utils/generateVV.js')

@Injectable()
export class IyfService {
  private readonly baseUrl: string
  private readonly logger = new AppLoggerService()

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('IYF_BASE_URL') || 'https://www.iyf.tv'
  }

  async fetchDramas(): Promise<Drama[]> {
    this.logger.log('Fetching dramas from iyf.tv API')
    try {
      const apiUrl =
        'https://m10.iyf.tv/api/list/Search?cinema=1&page=1&size=36&orderby=0&desc=1&cid=0,1,4&region=%E5%A4%A7%E9%99%86&isserial=-1&isIndex=-1&isfree=-1&vv=240239096692f5449edd9d734cf511b1&pub=CJSsEJSvDpWuE2umD3TVLLDVCJSqBZOtBZ8qDIuqNs8vD64uCs9YDpOtP3HYCMPXPJ0qDJ0qOp0tDM8mPZLZNsCqPZDXC64pE6CtPJ1bPZKmD3LbPM9bCc8pEJWvCpCs'

      const response = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      })

      const dramas = this.parseApiDramaList(response.data)
      this.logger.log(`Fetched ${dramas.length} dramas from API`)

      if (dramas.length === 0) {
        this.logger.warn('No dramas from API, using mock data')
        return this.getMockDramas()
      }

      return dramas
    } catch (error) {
      this.logger.error(
        'Failed to fetch dramas from API, using mock data',
        error.stack,
        'IyfService',
      )
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
        pub: pub,
      }

      const vvResult = generateVVWithResult(baseParams, { url: '', pub })

      const params = {
        ...baseParams,
        vv: vvResult.vv,
      }

      this.logger.log(`Fetching from iyf.tv API with generated pub:${pub} and vv:${vvResult.vv}`)

      const response = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        params,
      })

      const detail = this.parseApiDramaDetail(response.data)
      this.logger.log(`Fetched detail for drama: ${detail.data.detailInfo.title}`)
      return detail
    } catch (error) {
      this.logger.error(
        `Failed to fetch drama detail for mediaKey: ${mediaKey}, using mock data`,
        error.stack,
        'IyfService',
      )
      return this.getMockDramaDetail(mediaKey)
    }
  }

  async fetchStreamUrl(episodeKey: string): Promise<StreamUrl> {
    this.logger.log(`Fetching stream URL for episode: ${episodeKey}`)
    try {
      const url = `${this.baseUrl}/play/${episodeKey}`
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      })

      const streamUrl = this.parseStreamUrl(response.data)
      this.logger.log(`Fetched stream URL for episode: ${episodeKey}`)
      return streamUrl
    } catch (error) {
      this.logger.error(
        `Failed to fetch stream URL for episode: ${episodeKey}, using mock data`,
        error.stack,
        'IyfService',
      )
      return this.getMockStreamUrl(episodeKey)
    }
  }

  private parseApiDramaList(apiResponse: any): Drama[] {
    const dramas: Drama[] = []

    try {
      this.logger.log(`Parsing API response, ret: ${apiResponse.ret}`)

      if (apiResponse.ret === 200 && apiResponse.data && apiResponse.data.info) {
        const info = apiResponse.data.info
        this.logger.log(`API info type: ${typeof info}, is array: ${Array.isArray(info)}`)

        let result: any[] = []

        if (Array.isArray(info) && info.length > 0 && info[0].result) {
          result = info[0].result
          this.logger.log(`Extracted result from info[0].result, length: ${result.length}`)
        } else if (typeof info === 'object' && info.result) {
          result = info.result
          this.logger.log(`Extracted result from info.result, length: ${result.length}`)
        } else if (Array.isArray(info)) {
          result = info
          this.logger.log(`Using info array directly, length: ${result.length}`)
        }

        result.forEach((item: any) => {
          if (item.key && item.title) {
            dramas.push({
              id: item.key || '',
              title: item.title || '',
              description: item.contxt || 'No description available',
              imageUrl: item.image || '',
              totalEpisodes: item.isSerial ? parseInt(item.lastName) || 0 : 0,
            })
          }
        })
      }
    } catch (error) {
      this.logger.error('Error parsing API response', error.stack, 'IyfService')
    }

    return dramas
  }

  private parseDramaList(html: string): Drama[] {
    const $ = cheerio.load(html)
    const dramas: Drama[] = []

    $('.drama-item, .item, .video-item').each((index, element) => {
      const $el = $(element)
      const title = $el.find('.title, .name, h3').first().text().trim()
      const id = $el.find('a').first().attr('href')?.split('/').pop() || ''
      const imageUrl = $el.find('img').first().attr('src') || ''
      const description = $el.find('.desc, .description, .intro').first().text().trim()

      if (title && id) {
        dramas.push({
          id,
          title,
          description: description || 'No description available',
          imageUrl,
          totalEpisodes: 0,
        })
      }
    })

    return dramas
  }

  private parseDramaDetail(html: string): DramaDetail {
    const $ = cheerio.load(html)

    const uniqueID = $('meta[name="unique-id"]').attr('content') || ''
    const videoType = parseInt($('meta[name="video-type"]').attr('content') || '0') || 0
    const videoId = $('meta[name="video-id"]').attr('content') || ''
    const title = $('.detail-title, .drama-title, h1').first().text().trim()
    const starring = $('.starring, .cast, .actors').first().text().trim()
    const introduce = $('.introduce, .description, .summary').first().text().trim()
    const coverImgUrl = $('.cover, .poster img, .drama-cover img').first().attr('src') || ''
    const playCount = parseInt($('.play-count, .views').first().text().replace(/\D/g, '')) || 0

    const episodes: any[] = []
    $('.episode-item, .episode, .ep-list li').each((index, element) => {
      const $el = $(element)
      const episodeTitle = $el.text().trim()
      const episodeKey = $el.find('a').first().attr('href')?.split('/').pop() || ''
      const mediaKey = $el.attr('data-media') || ''

      if (episodeTitle) {
        episodes.push({
          episodeId: index + 1,
          episodeKey,
          mediaKey,
          title: '',
          episodeTitle,
          resolutionDes: 'HD',
          videoType,
          isVip: false,
        })
      }
    })

    return {
      ret: 0,
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

  private parseApiDramaDetail(apiResponse: any): DramaDetail {
    const data = apiResponse

    this.logger.log(
      `Parsing iyf.tv API response: ret=${data.ret}, has detailInfo=${!!data.data?.detailInfo}`,
    )

    const detailInfo = data.data?.detailInfo || {}

    const uniqueID = detailInfo.uniqueID || detailInfo.uniqueid || ''
    const videoId = detailInfo.videoId || detailInfo.videoid || ''
    const title = detailInfo.title || detailInfo.videoName || ''
    const starring = detailInfo.actors || detailInfo.starring || 'Unknown'
    const introduce = detailInfo.introduce || detailInfo.description || 'No description available'
    const coverImgUrl =
      detailInfo.coverImgUrl || detailInfo.img || detailInfo.image || detailInfo.cover || ''
    const playCount = parseInt(detailInfo.playCount) || 0

    const episodes: any[] = []
    if (Array.isArray(detailInfo.episodes) && detailInfo.episodes.length > 0) {
      this.logger.log(`Found ${detailInfo.episodes.length} episodes in response`)

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
    } else {
      this.logger.warn('No episodes found in response')
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

  private parseStreamUrl(html: string): StreamUrl {
    const $ = cheerio.load(html)

    const streamUrl =
      $('video source').attr('src') ||
      $('video').attr('src') ||
      $('.video-player').attr('data-src') ||
      ''

    return { streamUrl }
  }

  private getMockDramas(): Drama[] {
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
      {
        id: 'drama-5',
        title: '甄嬛传',
        description: '清宫剧经典',
        imageUrl: 'https://via.placeholder.com/300x450/FDCB6E/ffffff?text=甄嬛传',
        totalEpisodes: 76,
      },
    ]
  }

  private getMockDramaDetail(id: string): DramaDetail {
    const dramaMap: Record<string, any> = {
      'drama-1': {
        uniqueID: 'unique_001',
        videoId: 'video_001',
        title: '三体',
        starring: '张鲁一, 于和伟, 陈瑾, 王子文, 林永健, 李小冉',
        introduce:
          '根据刘慈欣同名小说改编，讲述了地球人类文明和三体文明的信息交流、生死搏杀及两个文明在宇宙中的兴衰历程。',
        coverImgUrl: 'https://via.placeholder.com/300x450/4A90E2/ffffff?text=三体',
        playCount: 9876543,
        videoType: 1,
      },
      'drama-2': {
        uniqueID: 'unique_002',
        videoId: 'video_002',
        title: '繁花',
        starring: '胡歌, 马伊琍, 唐嫣, 辛芷蕾',
        introduce: '王家卫执导的年代剧，讲述了90年代上海滩的商战传奇。',
        coverImgUrl: 'https://via.placeholder.com/300x450/E94B3C/ffffff?text=繁花',
        playCount: 7654321,
        videoType: 1,
      },
    }

    const defaultDetail = {
      uniqueID: 'unique_default',
      videoId: `video_${id}`,
      title: '电视剧',
      starring: '待定',
      introduce: '暂无介绍',
      coverImgUrl: 'https://via.placeholder.com/300x450/95A5A6/ffffff?text=电视剧',
      playCount: 123456,
      videoType: 1,
    }

    const drama = dramaMap[id] || defaultDetail

    const episodes = Array.from({ length: 30 }, (_, i) => ({
      episodeId: i + 1,
      episodeKey: `${id}-episode-${i + 1}`,
      mediaKey: `media-${id}-${i + 1}`,
      title: '',
      episodeTitle: `第${i + 1}集`,
      resolutionDes: 'HD',
      videoType: drama.videoType || 1,
      isVip: i < 5,
    }))

    return {
      ret: 0,
      data: {
        detailInfo: {
          uniqueID: drama.uniqueID,
          videoId: drama.videoId,
          title: drama.title,
          starring: drama.starring,
          introduce: drama.introduce,
          coverImgUrl: drama.coverImgUrl,
          playCount: drama.playCount,
          episodes,
        },
      },
    }
  }

  private getMockStreamUrl(episodeKey: string): StreamUrl {
    return {
      streamUrl: `https://example.com/video/${episodeKey}.m3u8`,
    }
  }
}
