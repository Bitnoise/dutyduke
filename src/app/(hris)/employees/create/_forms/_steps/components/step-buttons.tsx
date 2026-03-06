'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn } from '@/shared';
import { Button } from '../../../../../../../lib/ui';

type Props<TSteps = string> = {
  onNextButtonClick(nextStep?: TSteps): void;
  onBackButtonClick(prevStep?: TSteps): void;
  prevStep?: TSteps;
  nextStep?: TSteps;
};

export function StepButtons<TSteps>({
  onBackButtonClick,
  onNextButtonClick,
  prevStep,
  nextStep,
}: Props<TSteps>) {
  const t = useTranslations('ctaLabels');
  const tNext = useNextTranslations('ctaLabels');
  const backOrCancelLabel = t(prevStep ? 'goBack' : 'cancel');

  return (
    <div
      className={cn('flex justify-between gap-4', {
        'flex-col': !!nextStep,
      })}
    >
      <div className="flex justify-between pt-4">
        <div>
          <Button
            aria-label={tNext(backOrCancelLabel)}
            icon={prevStep ? 'arrow-left' : 'close'}
            iconPlacement="left"
            intent="tertiary"
            type="button"
            onClick={() => onBackButtonClick(prevStep)}
          >
            {backOrCancelLabel}
          </Button>
        </div>
        {nextStep && (
          <Button icon="arrow-right" type="button" onClick={() => onNextButtonClick(nextStep)}>
            {t('next')}
          </Button>
        )}
      </div>
    </div>
  );
}
