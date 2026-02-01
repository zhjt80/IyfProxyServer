import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { MoviesService } from './movies.service'

@ApiTags('movies')
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get movies list' })
  @ApiOkResponse({ description: 'Returns list of movies' })
  async getMovies() {
    return this.moviesService.findAll()
  }
}
