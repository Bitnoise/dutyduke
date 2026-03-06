import { z } from 'zod';

export const editFeedbackSchema = z.object({
  type: z.enum(['buddy', 'terminal', 'other', 'external']),
  date: z.string().min(1, 'Date is required'),
  facilitators: z.string().min(1, 'At least one facilitator is required'),
  noteBefore: z.string().optional(),
  noteForPerson: z.string().optional(),
  notes: z.string().optional(),
  feedbackScore: z.enum(['neutral', 'positive', 'negative']).optional(),
  clientFeedback: z.string().optional(),
  internalFeedback: z.string().optional(),
  isDone: z.boolean().optional(),
});

export type EditFeedbackForm = z.infer<typeof editFeedbackSchema>;
