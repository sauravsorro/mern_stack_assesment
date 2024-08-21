import { Controller, Post, Get, Body, Param, Res, Patch } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@ApiTags('Player')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('start')
  async startGame(@Body() body: CreatePlayerDto, @Res() res: Response) {
    return this.playersService.createPlayer(body, res);
  }

  @Get('leaderboard')
  async getLeaderboard(@Res() res: Response) {
    return this.playersService.getLeaderboard(res);
  }

  @Get(':id')
  async getPlayer(@Param('id') playerId: string, @Res() res: Response) {
    return this.playersService.getPlayer(playerId, res);
  }

  @Patch(':id')
  async updatePlayer(
    @Param('id') playerId: string,
    @Body() updateData: UpdatePlayerDto,
    @Res() res: Response,
  ) {
    return this.playersService.updatePlayer(playerId, updateData, res);
  }

  @Patch('use-fifty-fifty/:id/:questionId')
  async useFiftyFifty(
    @Param('id') playerId: string,
    @Param('questionId') questionId: string,
    @Res() res: Response,
  ) {
    return this.playersService.useFiftyFifty(playerId, questionId, res);
  }

  @Patch('use-ask-the-ai/:id/:questionId')
  async useAskTheAI(
    @Param('id') playerId: string,
    @Param('questionId') questionId: string,
    @Res() res: Response,
  ) {
    return this.playersService.useAskTheAI(playerId, questionId, res);
  }

  @Patch('quit/:id')
  async quitGame(@Param('id') playerId: string, @Res() res: Response) {
    return this.playersService.quitGame(playerId, res);
  }
}
