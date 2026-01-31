import { Module } from '@nestjs/common';
import { GetPlaydataController } from './getplaydata.controller';
import { GetPlaydataService } from './getplaydata.service';

@Module({
  controllers: [GetPlaydataController],
  providers: [GetPlaydataService],
})
export class GetPlaydataModule {}
