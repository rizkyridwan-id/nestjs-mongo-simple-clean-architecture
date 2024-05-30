import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import {
  BaseUseCase,
  IUseCasePayload,
} from 'src/core/base/module/use-case.base';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserRepository } from '../repository/user.repository.service';
import { Types } from 'mongoose';

type TDeleteUserPayload = Pick<IUseCasePayload<never>, '_id'>;
type TDeleteUserResponse = ResponseDto;

@Injectable()
export class DeleteUser extends BaseUseCase<
  TDeleteUserPayload,
  TDeleteUserResponse
> {
  constructor(@InjectUserRepository private userRepository: UserRepository) {
    super();
  }

  public async execute({
    _id,
  }: TDeleteUserPayload): Promise<TDeleteUserResponse> {
    try {
      const idConverted = new Types.ObjectId();
      await this.userRepository.delete({ _id: idConverted });
      return new ResponseDto({
        status: HttpStatus.OK,
        message: `${_id} documents deleted!`,
      });
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, 500);
    }
  }
}
