import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class SecuritySettings {
  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  sessionTimeout: boolean;

  @Prop({ default: true })
  deviceTracking: boolean;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ type: Date, required: false })
  dateOfBirth?: Date;

  @Prop({ type: SecuritySettings, default: () => ({}) })
  securitySettings: SecuritySettings;
}

export const UserSchema = SchemaFactory.createForClass(User);
