import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { StreamService } from './stream.service';

@ApiTags('stream')
@Controller('api/stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':episodeKey')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get stream URL by episodeKey' })
  @ApiOkResponse({ description: 'Returns video stream URL' })
  @ApiParam({ name: 'episodeKey', description: 'Episode key', example: '8nthjJkg0VA' })
  async getStream(@Param('episodeKey') episodeKey: string) {
    return this.streamService.getStreamUrl(episodeKey);
  }
}
