import * as z from 'zod';
import { UpdateUserRequest } from '../../port/user.request.port';

export const UpdateUserRequestDto = z.object({
  user_name: z.string(),
  level: z.string(),
}) satisfies z.ZodType<UpdateUserRequest>;
