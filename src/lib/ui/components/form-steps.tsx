'use client';

import { Fragment } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, type Steps, type FormStep } from '@/shared';

type FormStepsProps<TSteps = Steps> = {
  steps: FormStep<TSteps>[];
  currentStep: string;
  onStepClick(stepId: TSteps): void;
};

export function StepSeparator({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={cn('mx-1 hidden h-0.5 w-5 bg-disable-text sm:block', {
        'bg-accent': isActive,
      })}
    />
  );
}

export function FormSteps<TSteps = Steps>({ steps, currentStep, onStepClick }: FormStepsProps<TSteps>) {
  const t = useTranslations('formSteps');
  const tNext = useNextTranslations('formSteps');
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => {
        const { isDirty, stepId, title } = step;
        const labelClassName = cn(
          'text-disable-text flex justify-center items-center text-sm whitespace-nowrap transition-colors antialiased leading-6',
          {
            'text-black': isDirty,
            'cursor-default': !isDirty,
          },
        );

        return (
          <Fragment key={stepId as string}>
            <button
              aria-label={tNext('title', { title })}
              className={cn('hidden cursor-pointer flex-col items-center justify-center', {
                flex: currentStep === stepId,
                'sm:flex': currentStep,
              })}
              onClick={() => (isDirty ? onStepClick(stepId) : null)}
            >
              <div
                className={cn(
                  'box-border border-b-2 border-b-transparent transition-colors items-center flex',
                  {
                    'border-b-accent': currentStep === stepId,
                  },
                )}
              >
                <p className={labelClassName}>{t(title)}</p>
              </div>
            </button>
            {index !== steps.length - 1 && <StepSeparator isActive={isDirty} />}
          </Fragment>
        );
      })}
    </div>
  );
}
