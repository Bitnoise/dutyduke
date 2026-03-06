'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  handleActionError,
  HRIS_ROUTES,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { logger } from '@/shared/service/pino';
import { scheduleFeedbackSchema, type ScheduleFeedbackForm } from '../_schemas';

export type ScheduleFeedbackState = ActionReturnType<
  ScheduleFeedbackForm,
  ScheduleFeedbackForm,
  ActionReturnValidationErrorsType<ScheduleFeedbackForm>
>;

export async function scheduleFeedback(
  prevState: ScheduleFeedbackState,
  formData: FormData,
  employeeId?: string,
): Promise<ScheduleFeedbackState> {
  const form: ScheduleFeedbackForm = {
    type: (formData.get('type') as 'buddy' | 'terminal' | 'other') ?? 'buddy',
    date: (formData.get('date') as string) ?? '',
    facilitators: (formData.get('facilitators') as string) ?? '',
    note: (formData.get('note') as string) ?? '',
    isDone: formData.get('isDone') === 'true' || formData.get('isDone') === 'on',
  };

  const validationResult = scheduleFeedbackSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      form,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  if (!employeeId) {
    return {
      ...prevState,
      form,
      status: 'error',
      error: 'Employee ID is required',
    };
  }

  try {
    const api = hrisApi;

    // Parse facilitators: first one is hostId, rest are participants
    const facilitatorIds = validationResult.data.facilitators
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (facilitatorIds.length === 0) {
      return {
        ...prevState,
        form,
        status: 'validation-error',
        errors: {
          facilitators: ['At least one facilitator is required'],
        },
      };
    }

    const [hostId, ...participantIds] = facilitatorIds;

    // Map form data to CreateFeedbackDto
    const createFeedbackDto = {
      personId: employeeId,
      hostId,
      plannedDay: new Date(validationResult.data.date),
      type: validationResult.data.type,
      notes: validationResult.data.note || undefined,
      isDone: validationResult.data.isDone || undefined,
      participantIds: participantIds.length > 0 ? participantIds : undefined,
      // For "other" type, we'll need to handle feedbackScore separately
      // as it's not in the current form schema
    };

    await api.feedback.createFeedback(createFeedbackDto);
  } catch (err) {
    logger.info(err);
    return {
      ...prevState,
      form,
      ...handleActionError(err),
    };
  }

  revalidatePath(HRIS_ROUTES.employees.feedback.base(employeeId));

  redirect(HRIS_ROUTES.employees.feedback.base(employeeId));
}
