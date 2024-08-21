import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  currentLevel: number;

  @Prop({ required: true })
  prizeMoney: number;

  @Prop({ required: true })
  status: string; // Completed, Forfeited, or In Progress

  @Prop({ default: false })
  usedFiftyFifty: boolean;

  @Prop({ default: false })
  usedAskTheAI: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
