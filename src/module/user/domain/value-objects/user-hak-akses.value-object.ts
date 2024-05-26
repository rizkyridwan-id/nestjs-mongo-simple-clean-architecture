import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/core/base/domain/value-object';
import { DomainPrimitive } from 'src/core/base/types/domain-primitive.type';

export class UserHakAkses extends ValueObject<string> {
  constructor(value?: string) {
    super({ value: value! });
  }

  protected validate({ value }: DomainPrimitive<string>) {
    if (!value) return;
    try {
      JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Format Hak Akses tidak sesuai.');
    }
    // put validation logic here!
  }
}
