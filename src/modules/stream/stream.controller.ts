import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller('api/stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':episodeKey')
  @HttpCode(HttpStatus.OK)
  async getStream(@Param('episodeKey') episodeKey: string) {
    return this.streamService.getStreamUrl(episodeKey);
  }
}
