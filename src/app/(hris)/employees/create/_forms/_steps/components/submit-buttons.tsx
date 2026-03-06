import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from '@/lib/ui';
import { cn } from '@/shared';

type Props = {
  isSubmitting: boolean;
  isLastStep: boolean;
};

export function SubmitButtons({ isSubmitting, isLastStep }: Props) {
  const t = useTranslations('ctaLabels');
  return (
    <div
      className={cn('flex flex-row gap-y-4 justify-end items-end gap-x-4 pt-4', {
        'border-t border-divider': isLastStep,
      })}
    >
      <Button
        intent={isLastStep ? 'secondary' : 'primary'}
        isLoading={isSubmitting}
        name="create"
        type="submit"
      >
        {t('submitAndFinish')}
      </Button>
    </div>
  );
}
