import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IyfService } from './iyf.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [IyfService],
  exports: [IyfService],
})
export class IyfModule {}
