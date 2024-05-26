import { Entity } from 'src/core/base/domain/entity';
import { HashService } from 'src/core/helper/module/hash.service';
import { UserLevel } from './value-objects/user-level.value-object';
import { UserHakAkses } from './value-objects/user-hak-akses.value-object';
import { Types } from 'mongoose';
import { UpdateUserRequestDto } from '../controller/dtos/update-user.request.dto';

export interface UserProps {
  user_id: string;
  user_name: string;
  password: string;
  level: UserLevel;
  hak_akses_json?: UserHakAkses;
  input_by?: string;
}

export class UserEntity extends Entity<UserProps> {
  private static hashUtil: HashService = new HashService();

  constructor(props: UserProps, _id?: Types.ObjectId) {
    super(props, _id);
  }

  static async create(props: UserProps) {
    const hashPassword = await this.hashUtil.generate(props.password);

    return new UserEntity({
      user_id: props.user_id,
      user_name: props.user_name,
      password: hashPassword,
      level: props.level,
      hak_akses_json: props.hak_akses_json,
      input_by: props.input_by,
    });
  }

  static async comparePassword(rawPassword: string, hashedPassword: string) {
    return await this.hashUtil.compare(rawPassword, hashedPassword);
  }

  async updateUser(payload: UpdateUserRequestDto) {
    this.props.hak_akses_json = new UserHakAkses(payload.hak_akses_json);
    this.props.level = new UserLevel(payload.level);
    this.props.user_name = payload.user_name;
  }
}
