import * as z from 'zod';
import { LoginUserRequestProps } from '../../port/auth.request.port';

export const LoginRequestDto = z.object({
  user_id: z.string(),
  password: z.string(),
}) satisfies z.ZodType<LoginUserRequestProps>;
