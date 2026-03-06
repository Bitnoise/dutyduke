import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, type PropsWithClassName } from '@/shared';
import { EmptyBox } from './empty-box';

type Props = {
  message?: string;
  actionButton?: React.ReactNode;
};

export function NoResults({ message, className, actionButton }: PropsWithClassName<Props>) {
  const t = useTranslations();

  return (
    <div className={cn('flex w-full flex-col items-center justify-center gap-1 pt-8', className)}>
      <EmptyBox />
      <h3 className="pb-10 text-sm font-semibold">{t(message ?? 'noResults')}</h3>
      {actionButton && actionButton}
    </div>
  );
}
