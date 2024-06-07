import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectUserRepository } from '../repository/user.repository.provider';

import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { ResponseDto } from 'src/core/base/http/response.dto.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { UserRepository } from '../repository/user.repository.service';
import { Types } from 'mongoose';
import { UserMongoEntity } from '../repository/user.mongo-entity';
import { UpdateUserRequestProps } from '../contract/user.request.contract';

type TUpdateUserPayload = PickUseCasePayload<
  UpdateUserRequestProps,
  'data' | '_id'
>;
type TUpdateUserResponse = ResponseDto;
@Injectable()
export class UpdateUser extends BaseUseCase<
  TUpdateUserPayload,
  TUpdateUserResponse
> {
  constructor(@InjectUserRepository private userRepository: UserRepository) {
    super();
  }

  async execute({
    data,
    _id,
  }: TUpdateUserPayload): Promise<TUpdateUserResponse> {
    try {
      const idConverted = new Types.ObjectId(_id);
      const user = await this.userRepository.findById(idConverted);
      if (!user) throw new NotFoundException('User not found.');

      this._updateUserProps(user, data);

      await user.save();
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, 500);
    }
    return new ResponseDto({
      status: HttpStatus.OK,
      message: `User ${_id} documents updated`,
    });
  }

  private _updateUserProps(
    user: UserMongoEntity,
    data: UpdateUserRequestProps,
  ) {
    user.user_name = data.user_name;
    user.level = data.level;
  }
}
