import { Injectable } from '@nestjs/common'
import { IyfService } from '../../services/iyf/iyf.service'
import { Video } from '../../types'

@Injectable()
export class MoviesService {
  constructor(private readonly iyfService: IyfService) {}

  async findAll(): Promise<Video[]> {
    return this.iyfService.fetchMovies()
  }
}
