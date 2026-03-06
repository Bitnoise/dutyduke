'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { type EmployeeBenefitListWithAccessDto } from '@/api/hris/benefits/model/dtos';
import { GridList, GridListHeader, GridListItem } from '@/lib/ui';
import { cn, type CUID, type OrderBy, type PropsWithClassName, parseDate } from '@/shared';
import { useColumns } from '@/lib/ui/hooks';
import { EMPLOYEE_BENEFITS_TABLE_COLUMNS } from '@/app/(hris)/_constants';
import { EmployeeBenefitsItemMenu } from './employee-benefits-item-menu';
import { EmployeeBenefitsBulkActions } from './employee-benefits-bulk-actions';

type Props = {
  benefits: EmployeeBenefitListWithAccessDto;
  navigationEnabled: boolean;
  employeeId: CUID;
  dateFormat: string;
};

const SORT_KEYS = [
  { key: 'name-asc' },
  { key: 'name-desc' },
  { key: 'startDate-asc' },
  { key: 'startDate-desc' },
] as Array<{ key: OrderBy }>;

export function EmployeeBenefitsGridList({
  benefits,
  className,
  navigationEnabled: _navigationEnabled,
  employeeId,
  dateFormat,
}: PropsWithClassName<Props>): JSX.Element {
  const {
    items,
    _access: { columns, actions },
  } = benefits;

  const columnsToShow = useColumns(EMPLOYEE_BENEFITS_TABLE_COLUMNS, columns);
  const tNext = useNextTranslations('company.benefits');

  return (
    <>
      <GridListHeader
        className={cn(className, 'border-b border-b-divider')}
        searchParamKey="BENEFIT"
        selectionMode={actions.includes('select') ? 'multiple' : undefined}
        sortKeys={SORT_KEYS}
      >
        <div className="ml-auto">
          <EmployeeBenefitsBulkActions actions={actions} employeeId={employeeId} variant="small" />
        </div>
      </GridListHeader>
      <GridList
        aria-label={tNext('title')}
        className={cn(className)}
        searchParamKey={'BENEFIT'}
        selectionMode={actions.includes('select') ? 'multiple' : 'none'}
      >
        {items.map((benefit) => (
          <GridListItem
            key={benefit.id}
            className="border-b border-b-divider py-2"
            id={benefit.id}
            textValue={benefit.benefit.name}
          >
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-x-3 text-sm">
                {'benefit' in columnsToShow && (
                  <span className="block max-w-[14.375rem] truncate md:max-w-[21.875rem] lg:max-w-[31.25rem]">
                    {benefit.benefit.name}
                  </span>
                )}
              </div>
              <div className="text-text-light-body flex gap-x-4 text-xs">
                {'startDate' in columnsToShow && <span>{parseDate(benefit.startDate, dateFormat)}</span>}
              </div>
            </div>
            <div className="ml-auto">
              <EmployeeBenefitsItemMenu
                actions={actions}
                employeeBenefitId={benefit.id}
                employeeId={employeeId}
                variant="small"
              />
            </div>
          </GridListItem>
        ))}
      </GridList>
    </>
  );
}
