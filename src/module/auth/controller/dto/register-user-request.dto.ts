import * as z from 'zod';
import { RegisterUserRequestProps } from '../../port/auth.request.port';

export const RegisterUserRequestDto = z.object({
  user_id: z.string(),
  user_name: z.string(),
  password: z.string(),
}) satisfies z.ZodType<RegisterUserRequestProps>;
