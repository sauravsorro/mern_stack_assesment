import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { Response } from 'express';
import { CustomError } from 'src/common/exception';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async getCurrentQuestionForPlayer(page: number, res: Response) {
    try {
      const skip = (page - 1) * 1;

      const questions = await this.questionModel
        .find()
        .skip(skip)
        .limit(1)
        .exec();

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'Question fetch successfully.',
        data: questions[0] ?? {},
      });
    } catch (error) {
      throw CustomError.customException(
        error?.response?.message ? error.response.message : error.response,
        error?.response?.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async seedQuestions(): Promise<void> {
    const existingQuestions = await this.questionModel.countDocuments();
    if (existingQuestions > 0) return;

    const questions = [
      {
        question: 'What is 2+7?',
        options: ['3', '7', '9', '11'],
        correctAnswer: '9',
      },
      {
        question: 'What is 5x15?',
        options: ['25', '50', '75', '100'],
        correctAnswer: '75',
      },
      {
        question: 'What is 6x9?',
        options: ['54', '36', '24', '69'],
        correctAnswer: '54',
      },
      {
        question: 'What is 0+0?',
        options: ['0', '1', '100', '1000'],
        correctAnswer: '0',
      },
      {
        question: 'How many alphabets are there in the word ‘apple’?',
        options: ['10', '15', '5', '7'],
        correctAnswer: '5',
      },
      {
        question: 'What is the colour of moon?',
        options: ['red', 'orange', 'pink', 'white'],
        correctAnswer: 'white',
      },
      {
        question: 'How many legs does a chicken have?',
        options: ['1', '2', '4', '10'],
        correctAnswer: '2',
      },
      {
        question: 'Which one of these is not a programming language?',
        options: ['C', 'C++', 'Javascript', 'English'],
        correctAnswer: 'English',
      },
      {
        question: 'How many days are there in a week?',
        options: ['10', '5', '7', '6'],
        correctAnswer: '7',
      },
      {
        question: 'Which of these is not a react library inbuilt hook?',
        options: [
          'useState',
          'useRef',
          'useImperativeHandle',
          'useLocalStorage',
        ],
        correctAnswer: 'useLocalStorage',
      },
    ];

    await this.questionModel.insertMany(questions);
  }
}
