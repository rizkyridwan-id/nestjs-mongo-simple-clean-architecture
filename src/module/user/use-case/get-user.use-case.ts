import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { UserRepository } from '../repository/user.repository.service';
import { UserResponseProps } from '../port/user.response.port';
import { GetPaginationRequestQueryProps } from 'src/core/port/get-pagination.request.port';

export type TGetUserPayload = PickUseCasePayload<
  GetPaginationRequestQueryProps,
  'data'
>;
export type TGetUserResponse = ResponseDto<UserResponseProps[]>;
@Injectable()
export class GetUser extends BaseUseCase<TGetUserPayload, TGetUserResponse> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepository,
  ) {
    super();
  }
  async execute({ data }: TGetUserPayload): Promise<TGetUserResponse> {
    const users = await this.userRepository.findByPaginateSorted(
      { level: { $ne: 'SU' } },
      { skip: Number(data.skip), limit: Number(data.limit) },
      data.sort_by || { _id: 1 },
    );

    const usersMapped: UserResponseProps[] = users.map((user) => ({
      _id: user._id,
      level: user.level,
      user_id: user.user_id,
      user_name: user.user_name,
    }));

    return new ResponseDto({ status: HttpStatus.OK, data: usersMapped });
  }
}
