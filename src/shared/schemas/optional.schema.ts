import { z } from 'zod';

export const optionalSchema = z.string().nullable();
export const nullableSchema = z.string().transform((value) => value || null);
