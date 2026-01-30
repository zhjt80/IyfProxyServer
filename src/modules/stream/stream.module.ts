import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { IyfModule } from '../../services/iyf/iyf.module';

@Module({
  imports: [IyfModule],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
