import { Injectable } from '@nestjs/common'
import { IyfService } from '../../services/iyf/iyf.service'
import { Drama } from '../../types'

@Injectable()
export class MoviesService {
  constructor(private readonly iyfService: IyfService) {}

  async findAll(): Promise<Drama[]> {
    return this.iyfService.fetchMovies()
  }
}
