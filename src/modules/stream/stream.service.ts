import { Injectable } from '@nestjs/common';
import { IyfService } from '../../services/iyf/iyf.service';
import { StreamUrl } from '../../types';

@Injectable()
export class StreamService {
  constructor(private readonly iyfService: IyfService) {}

  async getStreamUrl(episodeKey: string): Promise<StreamUrl> {
    return this.iyfService.fetchStreamUrl(episodeKey);
  }
}
