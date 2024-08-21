import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsModule } from './questions/questions.module';
import { PlayersModule } from './players/players.module';
import 'dotenv/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ScheduleModule.forRoot(),
    QuestionsModule,
    PlayersModule,
  ],
})
export class AppModule {}
