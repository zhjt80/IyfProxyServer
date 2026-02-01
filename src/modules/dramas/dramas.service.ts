import { Injectable } from '@nestjs/common';
import { IyfService } from '../../services/iyf/iyf.service';
import { Video } from '../../types';

@Injectable()
export class DramasService {
  constructor(private readonly iyfService: IyfService) {}
  
  async findAll(): Promise<{ dramas: Video[] }> {
    const videos = await this.iyfService.fetchDramas();
    return { dramas: videos };
  }
}
