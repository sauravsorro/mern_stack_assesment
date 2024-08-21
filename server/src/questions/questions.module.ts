// src/questions/questions.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question, QuestionSchema } from './schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService], // Export QuestionsService so it can be used in other modules
})
export class QuestionsModule {}
