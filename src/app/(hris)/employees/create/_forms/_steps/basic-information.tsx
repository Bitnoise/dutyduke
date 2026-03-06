import { useStore } from 'jotai';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { FormControl, TextInput } from '@/lib/ui';
import { type Steps } from '@/shared';
import { type FormSteps } from '../../_types';
import { employeeCreationAtom } from '../../_store';
import { STEPS_NAVIGATION } from './steps';
import { StepButtons } from '.';

export function BasicInformation({
  errors,
  currentStep,
  handleBackButtonClick,
  handleNextButtonClick,
}: FormSteps<Steps>) {
  const t = useTranslations();
  const store = useStore();
  const data = store.get(employeeCreationAtom);

  const flexClassNames = 'flex flex-col gap-6 sm:flex-row';
  const basisHalfClassNames = 'basis-[calc(50%_-_0.75rem)]';

  const handleChange = (name: string, val: string) => {
    store.set(employeeCreationAtom, (prev) => {
      return { ...prev, [name]: val };
    });
  };

  const goToNextStep = () => {
    handleNextButtonClick('partnership');
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className={flexClassNames}>
        <FormControl errors={errors} name="firstName">
          {(formState) => (
            <TextInput
              isRequired
              autoFocus={currentStep === 'basicInformation'}
              defaultValue={data.firstName}
              label={t('forms.firstName')}
              onChange={(e) => handleChange('firstName', e)}
              {...formState}
            />
          )}
        </FormControl>
        <FormControl errors={errors} name="lastName">
          {(formState) => (
            <TextInput
              isRequired
              defaultValue={data.lastName}
              label={t('forms.lastName')}
              onChange={(e) => handleChange('lastName', e)}
              {...formState}
            />
          )}
        </FormControl>
      </div>
      <div className={flexClassNames}>
        <FormControl errors={errors} name="workEmail">
          {(formState) => (
            <TextInput
              isRequired
              className={basisHalfClassNames}
              defaultValue={data.workEmail}
              label={t('forms.email')}
              onChange={(e) => handleChange('workEmail', e)}
              {...formState}
            />
          )}
        </FormControl>
      </div>
      <StepButtons<Steps>
        nextStep={STEPS_NAVIGATION[currentStep].next}
        prevStep={STEPS_NAVIGATION[currentStep].prev}
        onBackButtonClick={handleBackButtonClick}
        onNextButtonClick={goToNextStep}
      />
    </div>
  );
}
