import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { AppLoggerService } from '../../services/logger.service'
const { generateVVWithResult, generatePub } = require('../../services/utils/generateVV.js')

@Injectable()
export class GetPlaydataService {
  private readonly logger = new AppLoggerService()

  async getPlaydata(mediaKey: string, videoId: string, videoType: string): Promise<any> {
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

      const params = {
        ...baseParams,
        vv: vvResult.vv,
      }

      this.logger.log(
        `Fetching from iyf.tv API with pub:${generatedPub}, DeviceId:${generatedDeviceId}, vv:${vvResult.vv}`,
      )

      const response = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        params,
      })

      this.logger.log(`Fetched playdata response:`, response.data)

      const responseData = response.data

      if (responseData.data && Array.isArray(responseData.data.list)) {
        const validItem = responseData.data.list.find(
          (item: any) => item.mediaUrl && item.mediaUrl !== null && item.mediaUrl !== '',
        )
        if (validItem) {
          return validItem
        }
        return responseData.data.list[0]
      }

      return responseData
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch playdata for mediaKey: ${mediaKey}, videoId: ${videoId}`,
        error.stack,
        'GetPlaydataService',
      )
      throw error
    }
  }

  private generateDeviceId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}
