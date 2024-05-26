import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';

import { InjectUserRepository } from 'src/module/user/repository/user.repository.provider';
import { UserEntity } from 'src/module/user/domain/user.entity';
import { UserRepositoryPort } from '../../../port/repository/user.repository.port';
import { LoginRequestDto } from '../controller/dto/login-user-request.dto';
import { UserMapper } from 'src/module/user/domain/user.mapper';

type TLoginPayload = PickUseCasePayload<LoginRequestDto, 'data'>;
@Injectable()
export class LoginUser extends BaseUseCase implements IUseCase<TLoginPayload> {
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
  ) {
    super();
  }

  public async execute({ data }: TLoginPayload): Promise<ResponseDto> {
    const userData = await this.userRepository.findOneOrThrow(
      {
        user_id: data.user_id,
      },
      'Username atau password salah.',
    );

    const userProps = userData.propsCopy;
    const passwordMatch = await UserEntity.comparePassword(
      data.password,
      userProps.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Username or Password is Incorrect.');
    }

    const jwtPayload = {
      sub: userProps.user_id,
    };

    const accessToken = Buffer.from(JSON.stringify(jwtPayload)).toString(
      'base64',
    );

    const userObject = UserMapper.toPlainObject(userData);
    return new ResponseDto({
      status: HttpStatus.OK,
      data: {
        user_id: userObject.user_id,
        access_token: accessToken,
        level: userObject.level,
        user_name: userObject.user_name,
        hak_akses_json: userObject.hak_akses_json,
      },
    });
  }
}
