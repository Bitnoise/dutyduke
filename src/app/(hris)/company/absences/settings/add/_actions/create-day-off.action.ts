'use server';

import dayjs from 'dayjs';
import {
  type ActionReturnValidationErrorsType,
  type ActionReturnType,
  handleActionError,
  ERROR_MESSAGES,
} from '@/shared';
import { hrisApi } from '@/api/hris';
import { createDayOffSchema, type CreateDayOffSchema } from '../_schemas/create-day-off.schema';

type State = ActionReturnType<
  CreateDayOffSchema,
  undefined,
  ActionReturnValidationErrorsType<CreateDayOffSchema>
>;

export async function createDayOff(prevState: State, formData: FormData): Promise<State> {
  const createErrorState = (errors: { [key in keyof CreateDayOffSchema]?: string[] | undefined }) => ({
    ...prevState,
    status: 'validation-error' as const,
    errors,
  });

  const form = {
    startDate: formData.get('startDate') as string,
    endDate: formData.get('endDate') as string,
    description: formData.get('description') as string,
  };

  const validationResult = createDayOffSchema.safeParse(form);

  if (!validationResult.success) {
    return createErrorState(validationResult.error.flatten().fieldErrors);
  }

  const start = dayjs(formData.get('startDate') as string).toDate();
  const end = dayjs(formData.get('endDate') as string).toDate();

  const api = hrisApi;

  const absences = await api.absences.getAllAbsences(1, start, end, ['APPROVED'], ['GLOBAL'], undefined, 1);

  if (absences.items.length > 0) {
    return createErrorState({ endDate: [ERROR_MESSAGES.ABSENCES.DATE_RANGE_OVERLAPS_EXISTING_ABSENCES] });
  }

  const { startDate, endDate, description } = validationResult.data;

  const me = await api.auth.getMe();

  try {
    await api.absences.requestAbsence({
      startDate,
      endDate,
      description,
      type: 'GLOBAL',
      reviewerId: me.id,
      status: 'APPROVED',
      issuerId: me.id,
    });
  } catch (err) {
    return {
      ...prevState,
      ...handleActionError(err),
    };
  }

  return {
    ...prevState,
    status: 'success',
    data: undefined,
  };
}
