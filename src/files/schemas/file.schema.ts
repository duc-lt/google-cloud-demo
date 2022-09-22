import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type FileDocument = File & mongoose.Document;

@Schema()
export class File {
  @Prop()
  url: string;

  @Prop()
  name: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
