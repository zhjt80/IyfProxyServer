import { Injectable } from '@nestjs/common';
import { IyfService } from '../../services/iyf/iyf.service';
import { Video } from '../../types';
import { GetDramasDto } from './dto/get-dramas.dto';

@Injectable()
export class DramasService {
  constructor(private readonly iyfService: IyfService) {}

  async findAll(query: GetDramasDto): Promise<{ dramas: Video[] }> {
    const filter:string = this.applyFilters(query);
    const allVideos = await this.iyfService.fetchDramas(filter);
    return { dramas: allVideos };
  }

  private applyFilters(query: GetDramasDto): string {
    const playCountRange = query.playCountRange ?? 0;
    const category = query.category ?? 0;
    const regional = query.regional ?? 0;
    const language = query.language ?? 0;
    const year = query.year ?? 0;
    return `${playCountRange},${category},${regional},${language},${year},0`;
  }


}
