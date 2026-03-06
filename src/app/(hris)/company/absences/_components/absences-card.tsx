import { type ReactNode, type PropsWithChildren } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn } from '@/shared';
import { Card } from '@/lib/ui';
import { BasicHeader } from '@/lib/ui/components/basic-header';
import { AbsencesTabs } from './absences-tabs';

type Props = {
  header?: string | ReactNode;
  className?: string;
};

export function AbsencesCard({ children, className, header }: PropsWithChildren<Props>): JSX.Element {
  const t = useTranslations('absences');

  return (
    <div className="flex min-h-full flex-1">
      <section className="relative z-10 flex-1 shadow-[0_4px_15px_0_rgba(39,55,75,0.06)]">
        <Card id="ExpandableCard">
          <BasicHeader>{header ?? t('header')}</BasicHeader>
          <AbsencesTabs />
          <div className={cn('min-h-full pt-2 md:pt-8', className)}>{children}</div>
        </Card>
      </section>
    </div>
  );
}
