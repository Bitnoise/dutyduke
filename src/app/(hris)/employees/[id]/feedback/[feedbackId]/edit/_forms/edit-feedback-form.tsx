'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import {
  type ActionReturnValidationErrorsType,
  cn,
  type PropsWithClassName,
  HRIS_ROUTES,
  type CUID,
} from '@/shared';
import {
  Button,
  Checkbox,
  DateField,
  Form,
  FormControl,
  Radio,
  RadioGroup,
  TagField,
  TextArea,
} from '@/lib/ui';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { useToast } from '@/lib/ui/hooks';
import { FEEDBACK_TOASTS } from '@/shared/constants/toast-notifications';
import { type EditFeedbackForm } from '../_schemas/edit-feedback.schema';
import { updateFeedbackAction, type UpdateFeedbackState } from '../_actions/update-feedback.action';

type Props = {
  form: EditFeedbackForm;
  errors?: ActionReturnValidationErrorsType<EditFeedbackForm>;
  employees: Item[];
  dateFormat: string;
  feedbackId: CUID;
  employeeId: CUID;
};

export function EditFeedbackForm({
  form,
  errors: _errors,
  employees,
  dateFormat,
  feedbackId,
  employeeId,
  className,
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations('employees.feedback.schedule');
  const router = useRouter();
  const pushToast = useToast();

  const defaultSelectedTags = form.facilitators ? form.facilitators.split(',').filter(Boolean) : [];

  const actionWithIds = async (prevState: UpdateFeedbackState, formData: FormData) => {
    return updateFeedbackAction(prevState, formData, feedbackId, employeeId);
  };

  const handleSuccess = () => {
    pushToast(FEEDBACK_TOASTS.UPDATE);
    router.push(HRIS_ROUTES.employees.feedback.base(employeeId));
  };

  return (
    <Form
      focusInputOnError
      action={actionWithIds}
      className={cn('flex flex-1 flex-col', className)}
      defaultState={{
        status: 'idle',
        form,
      }}
      onSuccess={handleSuccess}
    >
      {(formState, formErrors) => (
        <>
          <div className="flex-1 pb-12">
            <div className="flex flex-col gap-y-6">
              <p className="text-sm text-dark-grey">{t('selectType')}</p>
              <FormControl errors={formErrors} name="type">
                {(controlState) => (
                  <RadioGroup
                    isRequired
                    defaultValue={formState.type}
                    label={String(t('category'))}
                    {...controlState}
                  >
                    <Radio value="buddy">{t('type.buddy')}</Radio>
                    <Radio value="terminal">{t('type.terminal')}</Radio>
                    <Radio value="other">{t('type.other')}</Radio>
                    <Radio value="external">{t('type.external')}</Radio>
                  </RadioGroup>
                )}
              </FormControl>

              <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                <FormControl errors={formErrors} name="date">
                  {(controlState) => (
                    <DateField
                      autoFocus
                      isRequired
                      dateFormat={dateFormat}
                      defaultValue={formState.date}
                      label={t('date')}
                      {...controlState}
                    />
                  )}
                </FormControl>
                <div />
                <div className="col-span-full">
                  <FormControl errors={formErrors} name="facilitators">
                    {(controlState) => (
                      <TagField
                        isRequired
                        defaultSelectedTags={defaultSelectedTags}
                        items={employees}
                        label={t('facilitator')}
                        {...controlState}
                      />
                    )}
                  </FormControl>
                </div>
                <div className="col-span-full">
                  <FormControl errors={formErrors} name="noteBefore">
                    {(controlState) => (
                      <TextArea
                        defaultValue={formState.noteBefore || ''}
                        inputProps={{ placeholder: String(t('notePlaceholder')), rows: 4 }}
                        label={t('noteBefore')}
                        {...controlState}
                      />
                    )}
                  </FormControl>
                </div>
                <div className="col-span-full">
                  <FormControl errors={formErrors} name="noteForPerson">
                    {(controlState) => (
                      <TextArea
                        defaultValue={formState.noteForPerson || ''}
                        inputProps={{ placeholder: String(t('notePlaceholder')), rows: 4 }}
                        label={t('noteForPerson')}
                        {...controlState}
                      />
                    )}
                  </FormControl>
                </div>
                <div className="col-span-full">
                  <FormControl errors={formErrors} name="notes">
                    {(controlState) => (
                      <TextArea
                        defaultValue={formState.notes || ''}
                        inputProps={{ placeholder: String(t('notePlaceholder')), rows: 4 }}
                        label={t('note')}
                        {...controlState}
                      />
                    )}
                  </FormControl>
                </div>
                {formState.type === 'other' && (
                  <div className="col-span-full">
                    <FormControl errors={formErrors} name="feedbackScore">
                      {(controlState) => (
                        <RadioGroup
                          isRequired
                          defaultValue={formState.feedbackScore || 'neutral'}
                          label={String(t('feedbackScore'))}
                          {...controlState}
                        >
                          <Radio value="neutral">{t('feedbackScore.neutral')}</Radio>
                          <Radio value="positive">{t('feedbackScore.positive')}</Radio>
                          <Radio value="negative">{t('feedbackScore.negative')}</Radio>
                        </RadioGroup>
                      )}
                    </FormControl>
                  </div>
                )}
                <div className="col-span-full">
                  <FormControl errors={formErrors} name="internalFeedback">
                    {(controlState) => (
                      <TextArea
                        defaultValue={formState.internalFeedback || ''}
                        inputProps={{ placeholder: String(t('notePlaceholder')), rows: 4 }}
                        label={t('internalFeedback')}
                        {...controlState}
                      />
                    )}
                  </FormControl>
                </div>
                <div className="col-span-full">
                  <FormControl errors={formErrors} name="clientFeedback">
                    {(controlState) => (
                      <TextArea
                        defaultValue={formState.clientFeedback || ''}
                        inputProps={{ placeholder: String(t('notePlaceholder')), rows: 4 }}
                        label={t('clientFeedback')}
                        {...controlState}
                      />
                    )}
                  </FormControl>
                </div>
                <div className="col-span-full">
                  <FormControl errors={formErrors} name="isDone">
                    {(controlState) => (
                      <Checkbox defaultSelected={formState.isDone} {...controlState}>
                        {t('feedbackConducted')}
                      </Checkbox>
                    )}
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-x-2 border-t border-grey pt-4">
            <Button intent="secondary" onClick={() => router.back()}>
              {t('cancel')}
            </Button>
            <Button intent="primary" type="submit">
              {t('save')}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
