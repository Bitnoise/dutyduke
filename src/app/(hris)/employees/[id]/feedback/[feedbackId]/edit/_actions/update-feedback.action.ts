'use server';

import { revalidatePath } from 'next/cache';
import { hrisApi } from '@/api/hris';
import {
  handleActionError,
  HRIS_ROUTES,
  type ActionReturnType,
  type ActionReturnValidationErrorsType,
  type CUID,
} from '@/shared';
import { logger } from '@/shared/service/pino';
import { editFeedbackSchema, type EditFeedbackForm } from '../_schemas/edit-feedback.schema';

export type UpdateFeedbackState = ActionReturnType<
  EditFeedbackForm,
  undefined,
  ActionReturnValidationErrorsType<EditFeedbackForm>
>;

export async function updateFeedbackAction(
  prevState: UpdateFeedbackState,
  formData: FormData,
  feedbackId: CUID,
  employeeId: CUID,
): Promise<UpdateFeedbackState> {
  const form: EditFeedbackForm = {
    type: (formData.get('type') as 'buddy' | 'terminal' | 'other' | 'external') ?? 'buddy',
    date: (formData.get('date') as string) ?? '',
    facilitators: (formData.get('facilitators') as string) ?? '',
    noteBefore: (formData.get('noteBefore') as string) || undefined,
    noteForPerson: (formData.get('noteForPerson') as string) || undefined,
    notes: (formData.get('notes') as string) || undefined,
    feedbackScore: (formData.get('feedbackScore') as 'neutral' | 'positive' | 'negative') || undefined,
    clientFeedback: (formData.get('clientFeedback') as string) || undefined,
    internalFeedback: (formData.get('internalFeedback') as string) || undefined,
    isDone: formData.get('isDone') === 'true' || formData.get('isDone') === 'on',
  };

  const validationResult = editFeedbackSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      ...prevState,
      form,
      status: 'validation-error',
      errors: validationResult.error.flatten().fieldErrors,
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

    // Map form data to UpdateFeedbackDto
    const updateFeedbackDto = {
      hostId,
      plannedDay: new Date(validationResult.data.date),
      type: validationResult.data.type,
      noteBefore: validationResult.data.noteBefore || undefined,
      noteForPerson: validationResult.data.noteForPerson || undefined,
      notes: validationResult.data.notes || undefined,
      feedbackScore: validationResult.data.feedbackScore || undefined,
      clientFeedback: validationResult.data.clientFeedback || undefined,
      internalFeedback: validationResult.data.internalFeedback || undefined,
      isDone: validationResult.data.isDone || undefined,
      participantIds: participantIds.length > 0 ? participantIds : undefined,
    };

    await api.feedback.updateFeedback(feedbackId, updateFeedbackDto);

    revalidatePath(HRIS_ROUTES.employees.feedback.base(employeeId));

    return {
      ...prevState,
      form,
      status: 'success',
      data: undefined,
    };
  } catch (err) {
    logger.info(err);
    return {
      ...prevState,
      form,
      ...handleActionError(err),
    };
  }
}
