import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'tm_user' })
export class UserMongoEntity {
  @Prop({ required: true, unique: true })
  user_id: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  level: string;

  @Prop()
  input_by?: string;

  @Prop()
  input_date?: Date;

  @Prop()
  edit_by?: string;

  @Prop()
  edit_date?: Date;
}

export type UserDocument = HydratedDocument<UserMongoEntity>;
export const UserSchema = SchemaFactory.createForClass(UserMongoEntity);
export const UserModel = [{ name: UserMongoEntity.name, schema: UserSchema }];
