import { Injectable } from '@nestjs/common';
import { IyfService } from '../../services/iyf/iyf.service';
import { Video } from '../../types';
import { GetMoviesDto } from './dto/get-movies.dto';

@Injectable()
export class MoviesService {


  constructor(private readonly iyfService: IyfService) {}

  async findAll(query: GetMoviesDto): Promise<Video[]> {

    const filter:string = this.applyFilters(query);
    const allVideos = await this.iyfService.fetchMovies(filter);
    return allVideos;
  }

  private applyFilters(query: GetMoviesDto): string {
    const playCountRange = query.playCountRange ?? 0;
    const category = query.category ?? 0;
    const regional = query.regional ?? 0;
    const language = query.language ?? 0;
    const year = query.year ?? 0;
    return `${playCountRange},${category},${regional},${language},${year},0`;
  }
}
