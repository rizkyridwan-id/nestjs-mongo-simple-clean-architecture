import { Types } from 'mongoose';
import { IId } from 'src/core/interface/id.interface';

export interface UserResponseProps extends IId {
  _id: Types.ObjectId;
  user_id: string;
  user_name: string;
  level: string;
}
