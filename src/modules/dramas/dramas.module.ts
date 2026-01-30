import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DramasController } from './dramas.controller';
import { DramasService } from './dramas.service';
import { IyfModule } from '../../services/iyf/iyf.module';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '../../common/interceptors/timeout.interceptor';

@Module({
  imports: [IyfModule],
  controllers: [DramasController],
  providers: [
    DramasService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class DramasModule {}
