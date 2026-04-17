import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TourDocument = Tour & Document;

@Schema({ timestamps: true })
export class Tour {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  duration: number;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const TourSchema = SchemaFactory.createForClass(Tour);
