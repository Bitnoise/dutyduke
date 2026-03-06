'use client';

import { Provider } from 'jotai';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormSteps, InfoText } from '@/lib/ui';
import { useFormStepsNavigation, useToast } from '@/lib/ui/hooks';
import { cn, HRIS_ROUTES, type Steps } from '@/shared';
import { FORM_STEP_INFO } from '@/shared/constants/form-steps-info';
import { EMPLOYEE_GENERAL_TOASTS } from '@/shared/constants/toast-notifications';
import { employeeCreationAtom, store } from '../_store';
import { createEmployee } from '../_actions';
import { type EmployeeCreationForm } from '../_schemas';
import { BasicInformation, Partnership, STEPS, SubmitButtons } from './_steps';

export function EmployeeCreationForm({
  companyName,
  dateFormat,
}: {
  companyName: string;
  dateFormat: string;
}) {
  const storeData = store.get(employeeCreationAtom);
  const tNext = useNextTranslations('formSteps');
  const router = useRouter();
  const toast = useToast();

  const {
    currentStep,
    steps: updatedSteps,
    setCurrentStep,
    handleGoToNextStep,
    handleGoToPreviousStep,
  } = useFormStepsNavigation<Steps>('basicInformation', STEPS);

  const isLastStep = currentStep === 'partnership';

  const clearStore = () => {
    store.set(employeeCreationAtom, {
      firstName: '',
      lastName: '',
      workEmail: '',
      role: '',
      joinDate: '',
      employmentType: '',
      taxId: '',
      holiday: '',
      firstYearHoliday: '',
      bankAccount: '',
    });
  };

  const handleBackButtonClick = (step?: Steps) => {
    if (currentStep === 'basicInformation' || !step) {
      clearStore();
      router.push(HRIS_ROUTES.employees.base);
      return;
    }

    handleGoToPreviousStep(step);
  };

  const handleNextButtonClick = (step?: Steps) => {
    if (!step) return;

    handleGoToNextStep(step);
  };

  const handleSuccess = () => {
    toast(EMPLOYEE_GENERAL_TOASTS.CREATE);
    clearStore();
    router.push(HRIS_ROUTES.employees.base);
  };

  const handleError = (error?: string) => {
    setCurrentStep('basicInformation');
    if (error === 'usersLimitExceeded') {
      toast(EMPLOYEE_GENERAL_TOASTS.USER_LIMIT_EXCEEDED);
    }
  };

  return (
    <Provider store={store}>
      <FormSteps currentStep={currentStep} steps={updatedSteps} onStepClick={setCurrentStep} />
      <InfoText text={tNext(FORM_STEP_INFO[currentStep as keyof typeof FORM_STEP_INFO])} />
      <Form
        focusInputOnError
        action={createEmployee}
        defaultState={{
          status: 'idle',
          form: storeData,
        }}
        id="addEmployee"
        onEnter={isLastStep ? undefined : () => handleNextButtonClick('partnership')}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        {(_form, errors) => (
          <>
            <div
              className={cn('hidden', {
                block: currentStep === 'basicInformation',
              })}
            >
              <BasicInformation
                currentStep={currentStep}
                errors={errors}
                handleBackButtonClick={handleBackButtonClick}
                handleNextButtonClick={handleNextButtonClick}
              />
            </div>
            <div
              className={cn('hidden', {
                block: currentStep === 'partnership',
              })}
            >
              <Partnership
                companyName={companyName}
                currentStep={currentStep}
                dateFormat={dateFormat}
                errors={errors}
                handleBackButtonClick={handleBackButtonClick}
                handleNextButtonClick={handleNextButtonClick}
              />
            </div>
            <FormControl>
              {({ isSubmitting }) => (
                <SubmitButtons isLastStep={currentStep === 'basicInformation'} isSubmitting={isSubmitting} />
              )}
            </FormControl>
          </>
        )}
      </Form>
    </Provider>
  );
}
