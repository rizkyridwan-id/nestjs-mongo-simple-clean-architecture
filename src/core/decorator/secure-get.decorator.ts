import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { UserRequiredGuard } from '../guard/user-required.guard';

export function SecureGet(path = '') {
  return applyDecorators(UseGuards(UserRequiredGuard), Get(path));
}
