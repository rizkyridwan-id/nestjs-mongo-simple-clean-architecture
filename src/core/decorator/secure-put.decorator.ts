import { applyDecorators, Put, UseGuards } from '@nestjs/common';
import { UserRequiredGuard } from '../guard/user-required.guard';

export function SecurePut(path = '') {
  return applyDecorators(UseGuards(UserRequiredGuard), Put(path));
}
