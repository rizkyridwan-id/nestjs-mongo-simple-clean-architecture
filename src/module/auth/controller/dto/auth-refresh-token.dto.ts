import * as z from 'zod';
import { AuthRefreshTokenRequestProps } from '../../port/auth.request.port';

export const AuthRefreshTokenRequestDto = z.object({
  user_id: z.string(),
  refresh_token: z.string(),
}) satisfies z.ZodType<AuthRefreshTokenRequestProps>;
