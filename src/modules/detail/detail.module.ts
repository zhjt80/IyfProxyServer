import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { DetailService } from './detail.service';
import { IyfModule } from '../../services/iyf/iyf.module';

@Module({
  imports: [IyfModule],
  controllers: [DetailController],
  providers: [DetailService],
})
export class DetailModule {}
