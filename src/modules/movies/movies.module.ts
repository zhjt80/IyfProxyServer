import { Module } from '@nestjs/common'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'
import { IyfModule } from '../../services/iyf/iyf.module'

@Module({
  imports: [IyfModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
