import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePlayerDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  currentLevel?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  prizeMoney?: number;

  @ApiProperty()
  @IsEnum(['InProgress', 'Completed', 'Forfeited'])
  @IsNotEmpty()
  status?: string;
}
