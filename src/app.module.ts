import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DramasModule } from './modules/dramas/dramas.module';
import { DetailModule } from './modules/detail/detail.module';
import { StreamModule } from './modules/stream/stream.module';
import { GetPlaydataModule } from './modules/getplaydata/getplaydata.module';
import { IyfModule } from './services/iyf/iyf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    IyfModule,
    DramasModule,
    DetailModule,
    StreamModule,
    GetPlaydataModule,
  ],
})
export class AppModule {}
