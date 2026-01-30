import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { DramasService } from './dramas.service';

@Controller('api/dramas')
export class DramasController {
  constructor(private readonly dramasService: DramasService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDramas() {
    return this.dramasService.findAll();
  }
}
