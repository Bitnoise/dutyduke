'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { type BenefitListWithAccessDto } from '@/api/hris/benefits/model/dtos';
import { AvatarList, GridList, GridListHeader, GridListItem } from '@/lib/ui';
import { cn, type OrderBy, type PropsWithClassName, parseDate } from '@/shared';
import { BenefitsBulkActions } from '@/app/(hris)/company/benefits/_components/benefits-bulk-actions';
import { useColumns } from '@/lib/ui/hooks';
import { ALL_BENEFITS_TABLE_COLUMNS } from '@/app/(hris)/company/benefits/_constants';
import { BenefitsItemMenu } from '@/app/(hris)/company/benefits/_components/benefits-item-menu';

type Props = {
  benefits: BenefitListWithAccessDto;
  navigationEnabled: boolean;
  dateFormat: string;
};

const SORT_KEYS = [
  { key: 'name-asc' },
  { key: 'name-desc' },
  { key: 'createdAt-asc' },
  { key: 'createdAt-desc' },
] as Array<{ key: OrderBy }>;

export function BenefitsGridList({
  benefits,
  className,
  navigationEnabled: _navigationEnabled,
  dateFormat,
}: PropsWithClassName<Props>): JSX.Element {
  const {
    items,
    _access: { columns, actions },
  } = benefits;

  const columnsToShow = useColumns(ALL_BENEFITS_TABLE_COLUMNS, columns);
  const t = useNextTranslations('company.benefits');

  return (
    <>
      <GridListHeader
        className={cn(className, 'border-b border-b-divider')}
        searchParamKey="BENEFIT"
        selectionMode={actions.includes('select') ? 'multiple' : undefined}
        sortKeys={SORT_KEYS}
      >
        <div className="ml-auto">
          <BenefitsBulkActions actions={actions} benefits={benefits.items} variant="small" />
        </div>
      </GridListHeader>
      <GridList
        aria-label={t('title')}
        className={cn(className)}
        searchParamKey={'BENEFIT'}
        selectionMode={actions.includes('select') ? 'multiple' : 'none'}
      >
        {items.map((benefit) => (
          <GridListItem
            key={benefit.id}
            className="border-b border-b-divider py-2"
            id={benefit.id}
            textValue={benefit.name}
          >
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-x-3 text-sm">
                {'name' in columnsToShow && (
                  <span className="block max-w-[14.375rem] truncate md:max-w-[21.875rem] lg:max-w-[31.25rem]">
                    {benefit.name}
                  </span>
                )}
              </div>
              <div className="text-text-light-body flex gap-x-4 text-xs">
                {'assignedEmployees' in columnsToShow && (
                  <AvatarList
                    users={benefit.assignedEmployees.map((emp) => ({
                      name: `${emp.firstName} ${emp.lastName}`,
                      avatarId: emp.avatarId,
                    }))}
                    visibleCount={6}
                  />
                )}
                {'createdAt' in columnsToShow && <span>{parseDate(benefit.createdAt, dateFormat)}</span>}
              </div>
            </div>
            <div className="ml-auto">
              <BenefitsItemMenu actions={actions} benefitId={benefit.id} variant="small" />
            </div>
          </GridListItem>
        ))}
      </GridList>
    </>
  );
}
