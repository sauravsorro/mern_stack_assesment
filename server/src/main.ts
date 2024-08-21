import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QuestionsService } from './questions/questions.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const questionsService = app.get(QuestionsService);
  await questionsService.seedQuestions(); // Seed questions on startup

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Quiz App API')
    .setDescription('API documentation for the KBC-style Quiz App')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
