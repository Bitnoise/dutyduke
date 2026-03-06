'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, parseString, type FormStep } from '@/shared';
import { Button, Form, FormControl, FormSteps } from '@/lib/ui';
import { useFormStepsNavigation } from '@/lib/ui/hooks';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { type EquipmentDto } from '@/api/hris/resources/model/dtos';
import { createEquipment } from '../_actions';
import { BasicInfoForm } from './basic-info-form';
import { PurchaseInfoForm } from './purchase-info-form';

export const STEPS: FormStep<'basicInformation' | 'purchase'>[] = [
  {
    stepId: 'basicInformation',
    title: 'basicInformation',
    isDirty: true,
  },
  {
    stepId: 'purchase',
    title: 'purchase',
    isDirty: false,
  },
];

type Props = {
  equipment?: EquipmentDto;
  categories: Item[];
  locations: Item[];
  dateFormat: string;
};

export function CreateEquipmentForm({ equipment, categories, locations, dateFormat }: Props): JSX.Element {
  const {
    currentStep,
    steps: updatedSteps,
    setCurrentStep,
    handleGoToNextStep,
    handleGoToPreviousStep,
  } = useFormStepsNavigation<'basicInformation' | 'purchase'>('basicInformation', STEPS);
  const t = useTranslations('company.equipment.create');
  const router = useRouter();

  const isFirstStep = currentStep === 'basicInformation';
  const isLastStep = currentStep === 'purchase';

  const goToNextStep = () => {
    handleGoToNextStep('purchase');
  };

  const goToPreviousStep = () => {
    if (currentStep === 'basicInformation') {
      return router.back();
    }

    handleGoToPreviousStep('basicInformation');
  };

  const handleError = () => {
    setCurrentStep('basicInformation');
  };

  return (
    <>
      <div className="py-6">
        <FormSteps currentStep={currentStep} steps={updatedSteps} onStepClick={setCurrentStep} />
      </div>
      <Form
        focusInputOnError
        action={createEquipment}
        className="flex flex-1 flex-col"
        defaultState={{
          status: 'idle',
          form: {
            category: parseString(equipment?.category?.name, ''),
            signature: '',
            name: parseString(equipment?.name, ''),
            brand: parseString(equipment?.brand, ''),
            model: parseString(equipment?.model, ''),
            status: parseString(equipment?.status, ''),
            value: '',
            location: '',
            description: '',
            serial: '',
            avatar: undefined,
            invoiceNumber: '',
            supplier: '',
            purchaseDate: '',
            warrantyDuration: '',
            leaseDuration: '',
          },
        }}
        onEnter={isLastStep ? undefined : goToNextStep}
        onError={handleError}
      >
        {(form, errors) => (
          <>
            <div className="flex-1 pb-12 md:pb-0">
              <BasicInfoForm
                autoFocus={currentStep === 'basicInformation'}
                categories={categories}
                className={cn('hidden', {
                  grid: currentStep === 'basicInformation',
                })}
                errors={errors}
                form={form}
                locations={locations}
              />
              <PurchaseInfoForm
                autoFocus={currentStep === 'purchase'}
                className={cn('hidden', {
                  grid: currentStep === 'purchase',
                })}
                dateFormat={dateFormat}
                errors={errors}
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
                        {t('goNext')}
                      </Button>
                    )}
                  </div>
                  <hr className="bg-divider" />
                  <Button className="ml-auto" intent="secondary" isLoading={isSubmitting} type="submit">
                    {t('submit')}
                  </Button>
                </div>
              )}
            </FormControl>
          </>
        )}
      </Form>
    </>
  );
}
