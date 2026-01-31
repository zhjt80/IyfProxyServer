import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://10.0.2.2:3000', 'http://localhost:3000', 'exp://localhost:8081'],
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Iyf Server API')
    .setDescription('Proxy server for iyf.tv drama content')
    .setVersion('1.0')
    .addTag('dramas', 'Drama endpoints')
    .addTag('detail', 'Drama detail endpoints')
    .addTag('stream', 'Stream endpoints')
    .addTag('getplaydata', 'Video playdata endpoints')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(3000);
  console.log('🚀 IyfServer is running on: http://localhost:3000');
  console.log('📚 Swagger documentation: http://localhost:3000/api-docs');
}

bootstrap();
