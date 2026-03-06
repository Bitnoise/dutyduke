import { type ReactNode, type PropsWithChildren } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { SegmentLabel } from '@/lib/ui/components/segment-label';
import { Button } from '@/lib/ui/components';
import { cn, type PropsWithClassName } from '@/shared';
import { type IconNames } from '@/lib/ui/icons';

type Props = {
  heading?: string | ReactNode;
  headingClassName?: string;
  isEdit?: boolean;
  onEdit?: () => void;
  editLabel?: string | ReactNode;
  icon?: IconNames;
} & React.ComponentProps<'section'>;

export function Section({
  heading,
  isEdit = false,
  children,
  className,
  onEdit,
  editLabel,
  headingClassName,
  icon,
  ...rest
}: PropsWithClassName<PropsWithChildren<Props>>): JSX.Element {
  const t = useTranslations();

  return (
    <section {...rest}>
      {heading && (
        <div className="mb-6 flex w-full items-center justify-between border-b border-b-divider py-4 md:py-3.5">
          <SegmentLabel
            as="heading"
            className={cn('shrink-0 font-semibold pb-0 text-base text-black md:text-lg', headingClassName)}
          >
            {heading}
          </SegmentLabel>
          {isEdit && (
            <Button
              className="w-fit text-accent"
              icon={icon ?? 'edit-2'}
              iconPlacement="left"
              intent="ghost"
              size="sm"
              onClick={onEdit}
            >
              {editLabel ?? t('ctaLabels.edit')}
            </Button>
          )}
        </div>
      )}
      <div className={cn(className)}>{children}</div>
    </section>
  );
}
