import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppLoggerService } from '../../services/logger.service';
import { generateVV, generatePub } from '../../services/utils/generateVV';

@Injectable()
export class GetPlaydataService {
  private readonly logger = new AppLoggerService();

  async getPlaydata(mediaKey: string, videoId: string, videoType: string, episodeId: string, uniqueID:string ): Promise<any> {
    this.logger.log(`Fetching playdata for mediaKey: ${mediaKey}, videoId: ${videoId}`);

    try {
      const apiUrl = 'https://api.iyf.tv/api/video/getplaydata';
      const pub = generatePub();

      const baseParams: any = {
        mediaKey,
        videoId,
        videoType,
        episodeId,
        uniqueID,
        System: 'h5',
        AppVersion: '1.0',
        SystemVersion: 'h5',
        version: 'H3',
        i18n: '0',
        pub,
      };

      const vv = generateVV(baseParams, { url: apiUrl, pub });

      const params = {
        ...baseParams,
        vv,
      };

      this.logger.log(`Fetching from iyf.tv API with generated pub:${pub} and vv:${vv}`);


      const response = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        params,
      });

      this.logger.log(`Fetched playdata response:`, response.data);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to fetch playdata for mediaKey: ${mediaKey}, videoId: ${videoId}`, error.stack, 'GetPlaydataService');
      throw error;
    }
  }
}
