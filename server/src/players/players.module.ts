// src/players/players.module.ts

import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { QuestionsModule } from '../questions/questions.module'; // Import the QuestionsModule
import {
  Question,
  QuestionSchema,
} from 'src/questions/schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),

    QuestionsModule, // Add QuestionsModule to imports
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
