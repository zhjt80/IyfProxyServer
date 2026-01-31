import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { DetailService } from './detail.service';

@ApiTags('detail')
@Controller('api/detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get drama detail by mediaKey' })
  @ApiOkResponse({ description: 'Returns drama detail with episodes' })
  @ApiParam({ name: 'id', description: 'Drama mediaKey', example: 'yWFaVzMB6wF' })
  async getDetail(@Param('id') mediaKey: string) {
    return this.detailService.findOne(mediaKey);
  }
}
