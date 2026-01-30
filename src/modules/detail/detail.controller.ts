import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { DetailService } from './detail.service';

@Controller('api/detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('id') mediaKey: string) {
    return this.detailService.findOne(mediaKey);
  }
}
