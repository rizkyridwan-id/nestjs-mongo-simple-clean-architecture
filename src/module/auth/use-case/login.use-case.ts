import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';

import { EnvService } from 'src/infra/config/env.service';
import { InjectUserRepository } from 'src/module/user/repository/user.repository.provider';
import { LoginRequestDto } from '../controller/dto/login-user-request.dto';
import { UserRepository } from 'src/module/user/repository/user.repository.service';
import { HashService } from 'src/core/helper/module/hash.service';
import { LoginUserResponseDto } from 'src/port/dto/user.response-dto.port';

type TLoginPayload = PickUseCasePayload<LoginRequestDto, 'data'>;
type TLoginResponse = ResponseDto<LoginUserResponseDto>;
@Injectable()
export class LoginUser extends BaseUseCase<TLoginPayload, TLoginResponse> {
  constructor(
    @InjectUserRepository private userRepository: UserRepository,
    private jwtService: JwtService,
    private envService: EnvService,
    private hashService: HashService,
  ) {
    super();
  }

  public async execute({ data }: TLoginPayload): Promise<TLoginResponse> {
    const userData = await this.userRepository.findOneOrThrow(
      {
        user_id: data.user_id,
      },
      'Username atau password salah.',
    );

    const passwordMatch = await this.hashService.compare(
      data.password,
      userData.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Username or Password is Incorrect.');
    }

    const jwtPayload = {
      sub: userData.user_id,
    };

    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: 86400,
      secret: this.envService.variables.jwtRefreshKey,
    });

    return new ResponseDto({
      status: HttpStatus.OK,
      data: {
        user_id: userData.user_id,
        access_token: accessToken,
        refresh_token: refreshToken,
        level: userData.level,
        user_name: userData.user_name,
      },
    });
  }
}
