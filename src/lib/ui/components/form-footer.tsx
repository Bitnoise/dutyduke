'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, FormControl } from '@/lib/ui';
import { cn, type PropsWithClassName } from '@/shared';

type Props =
  | { children: React.ReactNode; saveLabel?: never; cancelLabel?: never; onCancel?: never }
  | {
      children?: never;
      saveLabel?: string;
      cancelLabel?: string;
      onCancel?: () => void;
    };

export function FormFooter({
  saveLabel,
  cancelLabel,
  children,
  className,
  onCancel,
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className={cn('flex gap-x-4', className)}>
      {children ?? (
        <>
          <FormControl>
            {({ isSubmitting }) => (
              <Button icon="ok" intent="primary" isLoading={isSubmitting} type="submit">
                {saveLabel ?? t('ctaLabels.save')}
              </Button>
            )}
          </FormControl>
          <FormControl>
            {({ isSubmitting }) => (
              <Button
                icon="close"
                intent="tertiary"
                isDisabled={isSubmitting}
                type="button"
                onClick={onCancel ?? router.back}
              >
                {cancelLabel ?? t('ctaLabels.cancel')}
              </Button>
            )}
          </FormControl>
        </>
      )}
    </div>
  );
}
