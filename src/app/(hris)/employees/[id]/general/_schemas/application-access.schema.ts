import { z } from 'zod';

export const createIdentitySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    roleKey: z.string().min(1, 'Role is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const updateIdentitySchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  confirmPassword: z.string().min(8).optional(),
  roleKey: z.string().optional(),
});

export type CreateIdentityForm = z.infer<typeof createIdentitySchema>;
export type UpdateIdentityForm = z.infer<typeof updateIdentitySchema>;
