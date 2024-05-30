import { Types } from 'mongoose';
import { IId } from '../interface/id.interface';

export interface UserResponseDtoProps extends IId {
  _id: Types.ObjectId;
  user_id: string;
  user_name: string;
  level: string;
  hak_akses_json?: string;
}

export interface LoginUserResponseDto {
  user_id: string;
  access_token: string;
  refresh_token: string;
  level: string;
  user_name: string;
}

export interface RefreshTokenResponseProps {
  access_token: string;
  refresh_token: string;
}
