import { Types } from 'mongoose';
import { IId } from 'src/port/interface/id.interface';

export class IdResponseDto implements IId {
  constructor(id: Types.ObjectId) {
    this._id = id;
  }

  _id: Types.ObjectId;
}
