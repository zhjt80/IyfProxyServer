import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetPlaydataService } from './getplaydata.service';

@ApiTags('getplaydata')
@Controller('api/getplaydata')
export class GetPlaydataController {
  constructor(private readonly getPlaydataService: GetPlaydataService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get video playdata (manifest URL)' })
  @ApiOkResponse({ description: 'Returns video manifest URL for HLS playback' })
  @ApiQuery({ name: 'mediaKey', description: 'Drama mediaKey', example: 'yWFaVzMB6wF' })
  @ApiQuery({ name: 'videoId', description: 'Video ID', example: '1207177' })
  @ApiQuery({ name: 'videoType', description: 'Video type', example: '1' })
  @ApiQuery({ name: 'episodeId', description: 'Episode ID', example: '1207177' })
  @ApiQuery({ name: 'uniqueID', description: 'Unique ID', example: 'yWFaVzMB6wF' })
  async getPlaydata(
    @Query('mediaKey') mediaKey: string,
    @Query('videoId') videoId: string,
    @Query('videoType') videoType: string,
    @Query('episodeId') episodeId: string,
    @Query('uniqueID') uniqueID: string,
  ) {
    return this.getPlaydataService.getPlaydata(mediaKey, videoId, videoType, episodeId, uniqueID);
  }
}
