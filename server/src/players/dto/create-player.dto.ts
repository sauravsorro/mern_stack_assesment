import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  currentLevel?: number;

  @IsNumber()
  @IsOptional()
  prizeMoney?: number;

  @IsEnum(['InProgress', 'Completed', 'Forfeited'])
  @IsOptional()
  status?: string;
}
