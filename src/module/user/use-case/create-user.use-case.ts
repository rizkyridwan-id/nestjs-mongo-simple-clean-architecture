import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BaseUseCase } from 'src/core/base/module/use-case.base';

import { OptionalSecretKey } from 'src/port/interface/optional-secret-key.interface';
import { EnvService } from 'src/infra/config/env.service';
import { CraeteUserRequestDto } from '../controller/dtos/create-user.request.dto';
import { InjectUserRepository } from '../repository/user.repository.provider';
import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { SHA256 } from 'crypto-js';
import { UserRepository } from '../repository/user.repository.service';
import { UserMongoEntity } from '../repository/user.mongo-entity';
import { HashService } from 'src/core/helper/module/hash.service';
import { IRepositoryResponse } from 'src/port/interface/repository-response.interface';
type TCreateUserPayload = PickUseCasePayload<
  CraeteUserRequestDto & OptionalSecretKey,
  'data' | 'user'
>;
type TCreateUserResponse = ResponseDto<IRepositoryResponse>;

@Injectable()
export class CreateUser extends BaseUseCase<
  TCreateUserPayload,
  TCreateUserResponse
> {
  constructor(
    @InjectUserRepository private userRepository: UserRepository,
    private envService: EnvService,
    private hashService: HashService,
  ) {
    super();
  }

  public async execute({
    data,
    user,
  }: TCreateUserPayload): Promise<TCreateUserResponse> {
    await this.userRepository.findOneAndThrow({ user_id: data.user_id });

    const isSecretKeyValid = await this._validateSecretKey(data.secretKey);
    const level = await this._generateUserLevel(isSecretKeyValid, data?.level);
    const hashedPassword = await this.hashService.generate(data.password);
    try {
      const userEntity: UserMongoEntity = {
        user_name: data.user_name,
        user_id: data.user_id,
        password: hashedPassword,
        level: level!,
        input_by: user?.user_id,
      };

      const result = await this.userRepository.save(userEntity);

      return new ResponseDto({ status: HttpStatus.CREATED, data: result });
    } catch (err) {
      this.logger.error(err);

      throw new HttpException(
        { message: err.message || err },
        err.message.includes('exists')
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async _validateSecretKey(secretKey?: string): Promise<boolean> {
    const systemSecretKey = SHA256(
      this.envService.variables.secretKey,
    ).toString();
    const isSecretKeyValid = secretKey && secretKey === systemSecretKey;

    if (secretKey && !isSecretKeyValid)
      throw new BadRequestException('Wrong Key Input. Transaction aborted.');

    return isSecretKeyValid || false;
  }
  private async _generateUserLevel(isSecretKeyValid: boolean, level?: string) {
    if (isSecretKeyValid)
      await this.userRepository.findOneAndThrow(
        { level: 'SU' },
        'Level System Sudah Terdaftar.',
      );
    return isSecretKeyValid ? 'SU' : level;
  }
}
