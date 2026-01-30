import { Injectable } from '@nestjs/common';
import { IyfService } from '../../services/iyf/iyf.service';
import { Drama } from '../../types';

@Injectable()
export class DramasService {
  constructor(private readonly iyfService: IyfService) {}

  async findAll(): Promise<{ dramas: Drama[] }> {
    const dramas = await this.iyfService.fetchDramas();
    return { dramas };
  }
}
