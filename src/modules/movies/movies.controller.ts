import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { GetMoviesDto } from './dto/get-movies.dto';

@ApiTags('movies')
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get movies with filters' })
  @ApiOkResponse({ description: 'Returns filtered movies' })
  @ApiQuery({ name: 'playCountRange', required: false, enum: [0, 1, 2, 3], description: '0=最新上传, 1=最近更新, 2=人气最高, 3=评分最高', default: 0 })
  @ApiQuery({ name: 'regional', required: false, type: String, description: 'Filter by region (e.g., 大陆, 韩国)' })
  @ApiQuery({ name: 'language', required: false, type: String, description: 'Filter by language (e.g., 国语, 韩语)' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category (e.g., 剧情, 喜剧)' })
  async getMovies(@Query() query: GetMoviesDto) {
    return this.moviesService.findAll(query);
  }
}
