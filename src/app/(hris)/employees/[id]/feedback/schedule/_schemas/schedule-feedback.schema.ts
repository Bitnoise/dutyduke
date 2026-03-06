import { z } from 'zod';

export const scheduleFeedbackSchema = z.object({
  type: z.enum(['buddy', 'terminal', 'other']),
  date: z.string().min(1, 'Date is required'),
  facilitators: z.string().min(1, 'At least one facilitator is required'),
  note: z.string().optional(),
  isDone: z.boolean().optional(),
});

export type ScheduleFeedbackForm = z.infer<typeof scheduleFeedbackSchema>;
