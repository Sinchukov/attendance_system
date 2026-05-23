import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS

  app.enableCors({
    origin: ['http://localhost:3001', 'http://172.18.10.118:3001'],

    credentials: true,
  });

  // VALIDATION

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,
    }),
  );

  // SWAGGER

  const config = new DocumentBuilder()
    .setTitle('University Attendance System API')
    .setDescription('API для системы учета посещаемости')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Server started on port 3000`);

  console.log(`Swagger: http://localhost:3000/api/docs`);
}

void bootstrap();
