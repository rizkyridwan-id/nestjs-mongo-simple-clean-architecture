import { applyDecorators, Post, UseGuards } from '@nestjs/common';
import { UserRequiredGuard } from '../guard/user-required.guard';

export function SecurePost(path = '') {
  return applyDecorators(UseGuards(UserRequiredGuard), Post(path));
}
