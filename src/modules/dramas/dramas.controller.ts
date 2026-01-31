import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { DramasService } from './dramas.service';

@ApiTags('dramas')
@Controller('api/dramas')
export class DramasController {
  constructor(private readonly dramasService: DramasService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all dramas' })
  @ApiOkResponse({ description: 'Returns list of all dramas' })
  async getDramas() {
    return this.dramasService.findAll();
  }
}
