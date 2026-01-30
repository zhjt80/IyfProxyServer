import { Injectable } from '@nestjs/common';
import { IyfService } from '../../services/iyf/iyf.service';
import { DramaDetail } from '../../types';

@Injectable()
export class DetailService {
  constructor(private readonly iyfService: IyfService) {}

  async findOne(id: string): Promise<DramaDetail> {
    return this.iyfService.fetchDramaDetail(id);
  }
}
