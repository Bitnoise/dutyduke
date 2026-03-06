'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import Link from 'next/link';
import { type AbsenceDTO, type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';
import { Button, GridList, GridListHeader, GridListItem } from '@/lib/ui';
import { type WithAccess, type Paginated, cn, type PropsWithClassName, HRIS_ROUTES } from '@/shared';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { DaysOffMenu } from './days-off-menu';

type AbsenceItem = Pick<AbsenceDTO, 'id' | 'type' | 'description'> & {
  dateRange: string;
};
type Props = {
  absences: WithAccess<Paginated<AbsenceItem>, { actions: AbsenceAction[] }>;
};

export function DaysOffGridList({ absences, className }: PropsWithClassName<Props>) {
  const { selectedItems } = useSelectItems('ABSENCES');
  const tNext = useNextTranslations('absences');
  const {
    items,
    _access: { actions },
  } = absences;

  return (
    <>
      <GridListHeader
        className={cn(className)}
        searchParamKey="ABSENCES"
        selectionMode={actions.includes('select') ? 'multiple' : undefined}
      >
        <div className="ml-auto">
          {actions.includes('delete') && selectedItems.length > 0 && (
            <DaysOffMenu absenceIds={selectedItems} actions={actions} variant="large" />
          )}
          {actions.includes('create') && !selectedItems.length && (
            <Link aria-label={tNext('add')} href={HRIS_ROUTES.company.absences.settings.add}>
              <Button icon="add" intent="primary" />
            </Link>
          )}
        </div>
      </GridListHeader>
      <GridList
        aria-label={tNext('header')}
        className={cn(className)}
        searchParamKey="ABSENCES"
        selectionMode={actions.includes('select') ? 'multiple' : undefined}
      >
        {items.map((absence) => (
          <GridListItem key={absence.id} className="flex items-center gap-x-6 text-sm" id={absence.id}>
            <div className="flex flex-col">
              <span>{absence.dateRange}</span>
              <span className="text-text-light-body line-clamp-1 text-xxs">{absence.description}</span>
            </div>
            <div className="ml-auto">
              <DaysOffMenu absenceIds={[absence.id]} actions={actions} />
            </div>
          </GridListItem>
        ))}
      </GridList>
    </>
  );
}
