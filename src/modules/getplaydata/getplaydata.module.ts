import { Module } from '@nestjs/common';
import { GetPlaydataController } from './getplaydata.controller';
import { GetPlaydataService } from './getplaydata.service';
import { IyfModule } from '../../services/iyf/iyf.module';

@Module({
  imports: [IyfModule],
  controllers: [GetPlaydataController],
  providers: [GetPlaydataService],
})
export class GetPlaydataModule {}
