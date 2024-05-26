import { applyDecorators, Patch, UseGuards } from '@nestjs/common';
import { UserRequiredGuard } from '../guard/user-required.guard';

export function SecurePatch(path = '') {
  return applyDecorators(UseGuards(UserRequiredGuard), Patch(path));
}
