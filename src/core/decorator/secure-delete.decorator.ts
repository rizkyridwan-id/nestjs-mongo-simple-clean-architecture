import { applyDecorators, Delete, UseGuards } from '@nestjs/common';
import { UserRequiredGuard } from '../guard/user-required.guard';

export function SecureDelete(path = '') {
  return applyDecorators(UseGuards(UserRequiredGuard), Delete(path));
}
