import { IsOptional, IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetMoviesDto {
  @ApiPropertyOptional({ enum: [0, 1, 2, 3], description: 'Filter by classification: 0=最新上传, 1=最近更新, 2=人气最高, 3=评分最高', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2, 3])
  playCountRange?: 0 | 1 | 2 | 3;

  @ApiPropertyOptional({ enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], description: 'Filter by region classifyId: 0=全部地区, 1=大陆, 2=香港, 3=台湾, 4=日本, 5=韩国, 6=欧美, 7=英国, 8=泰国, 9=其它', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  @IsNumber()
  regional?: number;

  @ApiPropertyOptional({ enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], description: 'Filter by language classifyId: 0=全部语言, 1=国语, 2=粤语, 3=英语, 4=韩语, 5=日语, 6=西班牙语, 7=法语, 8=德语, 9=意大利语, 10=泰国语, 11=其它', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  @IsNumber()
  language?: number;

  @ApiPropertyOptional({ enum: [0, 1, 2, 3, 4, 5, 6], description: 'Filter by year classifyId: 0=全部年份, 1=今年, 2=去年, 3=更早, 4=90年代, 5=80年代, 6=怀旧', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2, 3, 4, 5, 6])
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({
    enum: [0, 129, 127, 126, 141, 142, 136, 132, 143, 144, 135, 133, 128, 145, 131, 138, 130, 134, 137, 139, 140, 147, 148, 149, 150, 151, 152, 153, 154, 155],
    description: 'Filter by category classifyId: 0=全部类型, 129=偶像, 127=言情, 146=爱情, 126=古装, 141=历史, 142=玄幻, 136=谍战, 132=都市, 143=历险, 144=科幻, 135=军旅, 133=喜剧, 128=武侠, 145=江湖, 131=青春, 138=罪案, 130=家庭, 134=战争, 137=悬疑, 139=穿越, 140=宫廷, 147=神话, 148=商战, 149=警匪, 150=动作, 151=惊悚, 152=剧情, 153=同性, 154=奇幻, 155=短剧',
    default: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 129, 127, 126, 141, 142, 136, 132, 143, 144, 135, 133, 128, 145, 131, 138, 130, 134, 137, 139, 140, 147, 148, 149, 150, 151, 152, 153, 154, 155])
  @IsNumber()
  category?: number;

}