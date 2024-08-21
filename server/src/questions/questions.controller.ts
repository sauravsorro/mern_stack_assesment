import { Controller, Get, Query, Res } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Question')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async getCurrentQuestionForPlayer(
    @Query('page') page: number = 1,
    @Res() res: Response,
  ) {
    return this.questionsService.getCurrentQuestionForPlayer(page, res);
  }
}
