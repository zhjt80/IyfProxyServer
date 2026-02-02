import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { DramasService } from './dramas.service';
import { GetDramasDto } from './dto/get-dramas.dto';

@ApiTags('dramas')
@Controller('api/dramas')
export class DramasController {
  constructor(private readonly dramasService: DramasService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get dramas with filters' })
  @ApiOkResponse({ description: 'Returns filtered dramas' })
  @ApiQuery({ name: 'playCountRange', required: false, enum: [0, 1, 2, 3], description: '0=最新上传, 1=最近更新, 2=人气最高, 3=评分最高', default: 0 })
  @ApiQuery({ name: 'regional', required: false, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], description: '0=全部地区, 1=大陆, 2=香港, 3=台湾, 4=日本, 5=韩国, 6=欧美, 7=英国, 8=泰国, 9=其它', default: 0 })
  @ApiQuery({ name: 'language', required: false, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], description: '0=全部语言, 1=国语, 2=粤语, 3=英语, 4=韩语, 5=日语, 6=西班牙语, 7=法语, 8=德语, 9=意大利语, 10=泰国语, 11=其它', default: 0 })
  @ApiQuery({ name: 'category', required: false, enum: [0, 129, 127, 126, 141, 142, 136, 132, 143, 144, 135, 133, 128, 145, 131, 138, 130, 134, 137, 139, 140, 147, 148, 149, 150, 151, 152, 153, 154, 155], description: 'Filter by category classifyId', default: 0 })
  @ApiQuery({ name: 'year', required: false, enum: [0, 1, 2, 3, 4, 5, 6], description: '0=全部年份, 1=今年, 2=去年, 3=更早, 4=90年代, 5=80年代, 6=怀旧', default: 0 })
  async getVideos(@Query() query: GetDramasDto) {
    return this.dramasService.findAll(query);
  }
}
