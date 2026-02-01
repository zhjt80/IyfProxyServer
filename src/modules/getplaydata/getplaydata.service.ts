import { Injectable } from '@nestjs/common'
import { IyfService } from '../../services/iyf/iyf.service'
import { AppLoggerService } from '../../services/logger.service'

@Injectable()
export class GetPlaydataService {
  private readonly logger = new AppLoggerService()

  constructor(private readonly iyfService: IyfService) {}

  async getPlaydata(mediaKey: string, videoId: string, videoType: string): Promise<any> {
    this.logger.log(`Fetching playdata for mediaKey: ${mediaKey}, videoId: ${videoId}`)
    return this.iyfService.fetchPlaydata(mediaKey, videoId, videoType)
  }
}
