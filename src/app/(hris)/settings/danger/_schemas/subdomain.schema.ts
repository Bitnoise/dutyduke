import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared';

export const subdomainSchema = z.object({
  subdomain: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: ERROR_MESSAGES.SUBDOMAIN.INVALID }),
});

export type SubdomainForm = z.input<typeof subdomainSchema>;
export type SubdomainSchema = z.output<typeof subdomainSchema>;
