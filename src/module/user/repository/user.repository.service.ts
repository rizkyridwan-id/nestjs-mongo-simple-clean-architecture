import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserMongoEntity } from './user.mongo-entity';

import { BaseRepository } from 'src/core/base/module/repository.base';

@Injectable()
export class UserRepository extends BaseRepository<
  UserMongoEntity,
  UserDocument
> {
  constructor(
    @InjectModel(UserMongoEntity.name)
    private userModel: Model<UserMongoEntity>,
  ) {
    super(userModel);
  }

  async findActiveUser(): Promise<Array<UserDocument>> {
    return await this.userModel.find({ status: true });
  }
}
