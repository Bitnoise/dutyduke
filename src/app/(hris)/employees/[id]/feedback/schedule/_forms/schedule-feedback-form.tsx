'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, type FormStep } from '@/shared';
import { Button, Form, FormControl, FormSteps } from '@/lib/ui';
import { useFormStepsNavigation } from '@/lib/ui/hooks';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { type ScheduleFeedbackForm } from '../_schemas';
import { scheduleFeedback, type ScheduleFeedbackState } from '../_actions/schedule-feedback.action';
import { CategoryStepForm } from './category-step-form';
import { DetailsStepForm } from './details-step-form';

export const STEPS: FormStep<'category' | 'feedback'>[] = [
  {
    stepId: 'category',
    title: 'category',
    isDirty: true,
  },
  {
    stepId: 'feedback',
    title: 'feedback',
    isDirty: false,
  },
];

type Props = {
  employeeId: string;
  employees: Item[];
  dateFormat: string;
};

export function ScheduleFeedbackForm({ employeeId, employees, dateFormat }: Props): JSX.Element {
  const {
    currentStep,
    steps: updatedSteps,
    setCurrentStep,
    handleGoToNextStep,
    handleGoToPreviousStep,
  } = useFormStepsNavigation<'category' | 'feedback'>('category', STEPS);
  const t = useTranslations('employees.feedback.schedule');
  const router = useRouter();

  const isFirstStep = currentStep === 'category';
  const isLastStep = currentStep === 'feedback';

  const goToNextStep = () => {
    handleGoToNextStep('feedback');
  };

  const goToPreviousStep = () => {
    if (currentStep === 'category') {
      return router.back();
    }

    handleGoToPreviousStep('category');
  };

  const handleError = () => {
    setCurrentStep('category');
  };

  const handleSuccess = () => {
    // Navigation is handled by the server action redirect
  };

  const actionWithEmployeeId = async (prevState: ScheduleFeedbackState, formData: FormData) => {
    return scheduleFeedback(prevState, formData, employeeId);
  };

  return (
    <>
      <div className="py-6">
        <FormSteps currentStep={currentStep} steps={updatedSteps} onStepClick={setCurrentStep} />
      </div>
      <Form
        focusInputOnError
        action={actionWithEmployeeId}
        className="flex flex-1 flex-col"
        defaultState={{
          status: 'idle',
          form: {
            type: 'buddy',
            date: '',
            facilitators: '',
            note: '',
            isDone: false,
          },
        }}
        onEnter={isLastStep ? undefined : goToNextStep}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <div className="flex-1 pb-12">
              <CategoryStepForm
                autoFocus={currentStep === 'category'}
                className={cn('hidden', {
                  flex: currentStep === 'category',
                })}
                errors={errors}
                form={form}
              />
              <DetailsStepForm
                autoFocus={currentStep === 'feedback'}
                className={cn('hidden', {
                  grid: currentStep === 'feedback',
                })}
                dateFormat={dateFormat}
                employees={employees}
                errors={errors}
                form={form}
              />
            </div>
            <FormControl>
              {({ isSubmitting }) => (
                <div className="flex flex-col gap-y-6">
                  <div className="flex items-center justify-between">
                    <Button
                      icon={isFirstStep ? 'close' : 'arrow-left'}
                      intent="tertiary"
                      isDisabled={isSubmitting}
                      type="button"
                      onClick={goToPreviousStep}
                    >
                      {isFirstStep ? t('cancel') : t('goBack')}
                    </Button>
                    {!isLastStep && (
                      <Button
                        icon="arrow-right"
                        iconPlacement="right"
                        intent="primary"
                        isLoading={isSubmitting}
                        type="button"
                        onClick={goToNextStep}
                      >
                        {t('next')}
                      </Button>
                    )}
                  </div>
                  <hr className="bg-divider" />
                  {isLastStep && (
                    <Button className="ml-auto" intent="secondary" isLoading={isSubmitting} type="submit">
                      {t('submit')}
                    </Button>
                  )}
                </div>
              )}
            </FormControl>
          </>
        )}
      </Form>
    </>
  );
}
