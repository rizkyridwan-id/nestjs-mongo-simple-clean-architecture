import { GetPaginationRequestQueryProps } from 'src/core/port/get-pagination.request.port';
import * as z from 'zod';

export const GetPaginationRequestDto = z.object({
  skip: z
    .string()
    .regex(/\d+/, { message: 'Format skip tidak valid' })
    .optional(),
  limit: z
    .string()
    .regex(/\d+/, { message: 'Format limit tidak valid' })
    .optional(),
  first: z.enum(['true', 'false']).optional(),
  sort_by: z
    .record(z.enum(['asc', 'ascending', 'desc', 'descending']))
    .optional(),
}) satisfies z.ZodType<GetPaginationRequestQueryProps>;
