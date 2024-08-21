import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { Response } from 'express';
import { CustomError } from 'src/common/exception';
import { CreatePlayerDto } from './dto/create-player.dto';
import { idInvalid } from 'src/utils';
import { UpdatePlayerDto } from './dto/update-player.dto';
import {
  Question,
  QuestionDocument,
} from 'src/questions/schemas/question.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  @Cron('*/30 * * * * *') // Runs every 30 seconds
  async markIncompleteGamesAsForfeited() {
    try {
      const currentTime = new Date();

      const inactiveThreshold = new Date(currentTime.getTime() - 30 * 1000);

      await this.playerModel.updateMany(
        {
          status: 'InProgress',
          updatedAt: { $lt: inactiveThreshold },
        },
        {
          $set: {
            status: 'Forfeited',
            prizeMoney: 0,
          },
        },
      );
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async createPlayer(body: CreatePlayerDto, res: Response) {
    try {
      const newPlayer = await this.playerModel.create({
        name: body.name,
        currentLevel: 0,
        prizeMoney: 0,
        status: 'InProgress',
      });
      return res.send({
        statusCode: HttpStatus.CREATED,
        message: 'Game Start',
        data: newPlayer,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async getPlayer(playerId: string, res: Response) {
    try {
      if (!idInvalid(playerId)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const findPlayer = await this.playerModel.findById(playerId).exec();
      if (!findPlayer) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return res.send({
        statusCode: HttpStatus.CREATED,
        message: 'Player Get Successfully.',
        data: findPlayer,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async updatePlayer(
    playerId: string,
    updateData: UpdatePlayerDto,
    res: Response,
  ) {
    try {
      if (!idInvalid(playerId)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const findPlayer = await this.playerModel.findById(playerId).exec();
      if (!findPlayer) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      const updatePlayer = await this.playerModel
        .findByIdAndUpdate(playerId, updateData, { new: true })
        .exec();
      return res.send({
        statusCode: HttpStatus.CREATED,
        message: 'Player Update Successfully',
        data: updatePlayer,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async getLeaderboard(res: Response) {
    try {
      const getAllUser = await this.playerModel
        .find()
        .sort({ prizeMoney: -1 })
        .exec();

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'Users List fetch Successfully.',
        data: getAllUser,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async useFiftyFifty(playerId: string, questionId: string, res: Response) {
    try {
      if (!idInvalid(playerId) || !idInvalid(questionId)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const player = await this.playerModel.findById(playerId);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      if (player.usedFiftyFifty) {
        throw new HttpException(
          '50-50 lifeline already used',
          HttpStatus.BAD_REQUEST,
        );
      }
      player.usedFiftyFifty = true;
      await player.save();

      const question = await this.questionModel.findOne({
        _id: questionId,
      });
      if (!question) {
        throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
      }

      // Filter out the incorrect options randomly until two are left
      const incorrectOptions = question.options.filter(
        (option) => option !== question.correctAnswer,
      );
      const remainingIncorrect = incorrectOptions.slice(0, 1); // Pick 1 incorrect answers
      const remainingOption = [
        question.correctAnswer,
        ...remainingIncorrect,
      ].sort(() => 0.5 - Math.random());
      return res.send({
        statusCode: HttpStatus.OK,
        message: '50-50 options fetch successfully.',
        data: remainingOption,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async useAskTheAI(playerId: string, questionId: string, res: Response) {
    try {
      if (!idInvalid(playerId) || !idInvalid(questionId)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const player = await this.playerModel.findById(playerId);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      if (player.usedAskTheAI) {
        throw new HttpException(
          'AskTheAI lifeline already used',
          HttpStatus.BAD_REQUEST,
        );
      }
      player.usedAskTheAI = true;
      await player.save();

      const question = await this.questionModel.findOne({
        _id: questionId,
      });
      if (!question) {
        throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
      }

      // Provide the correct answer as a hint
      return res.send({
        statusCode: HttpStatus.OK,
        message: 'answer fetch successfully.',
        data: question.correctAnswer,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async quitGame(playerId: string, res: Response) {
    try {
      if (!idInvalid(playerId)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const player = await this.playerModel.findById(playerId);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }

      if (player.currentLevel < 4) {
        throw new HttpException(
          'You can only quit the game after reaching level 4 (Rs 1000).',
          HttpStatus.BAD_REQUEST,
        );
      }
      player.status = 'Completed';
      await player.save();

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'Quit Game successfully.',
        data: player,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }
}
