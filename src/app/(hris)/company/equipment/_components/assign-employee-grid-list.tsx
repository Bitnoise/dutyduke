'use client';

import { type GridListProps } from 'react-aria-components';
import { useTranslations as useNextTranslations } from 'next-intl';
import { type EmployeeListDto } from '@/api/hris/employees/model/dtos';
import { GridList, GridListHeader, GridListItem } from '@/lib/ui/components/grid-list';
import { cn, HRIS_ROUTES, type PropsWithClassName, type OrderBy, parseString } from '@/shared';
import {} from '@/app/(hris)/employees/[id]/_components/employee-bulk-menu';
import { BottomSheet, Button } from '@/lib/ui';
import { useModal } from '@/lib/ui/hooks';
import { FilterTag } from '@/lib/ui/components/filter-tag';

type Props<T> = {
  isNavigationEnabled?: boolean;
  data: EmployeeListDto;
} & GridListProps<T>;

const SORT_KEYS = [{ key: 'lastName-asc' }, { key: 'lastName-desc' }] as Array<{ key: OrderBy }>;

export function AssignEmployeesGridList<T>({
  data,
  isNavigationEnabled,
  className,
  selectionMode,
}: PropsWithClassName<Props<T>>): JSX.Element {
  const t = useNextTranslations();
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();

  const {
    items,
    _access: { actions },
  } = data;

  return (
    <>
      <GridListHeader
        className={cn(className)}
        searchParamKey="EMPLOYEES"
        selectionMode="single"
        sortKeys={SORT_KEYS}
      >
        {actions.includes('filter') && (
          <Button className="mr-auto" icon="filter" intent="tertiary" onClick={openModal} />
        )}
      </GridListHeader>
      <GridList
        aria-label={t('employees.employeesList')}
        className={cn(className)}
        searchParamKey="EMPLOYEES"
        selectionMode={selectionMode}
      >
        {items.map((employee, index) => (
          <GridListItem
            key={employee.id}
            className={cn('border-b border-divider py-2', {
              'border-y': index === 0,
            })}
            href={isNavigationEnabled ? HRIS_ROUTES.employees.general.base(employee.id) : undefined}
            id={employee.id}
            textValue={`${employee.firstName} ${employee.lastName}`}
          >
            <div
              className={cn('flex flex-1 flex-col', {
                'text-text-disabled italic': employee.status === 'ARCHIVED',
                'cursor-pointer': isNavigationEnabled,
              })}
            >
              <div className="flex gap-x-3">
                <p>{employee.firstName}</p>
                <p>{employee.lastName}</p>
              </div>
              <p className="text-text-light-body text-xxs">{parseString(employee.role)}</p>
            </div>
          </GridListItem>
        ))}
      </GridList>
      <BottomSheet isOpen={isOpen} label={t('filters.filters')} onClose={closeModal} onOpenChange={setIsOpen}>
        <div className="flex flex-col gap-y-4">
          <FilterTag searchParamKey="FILTER" value="ACTIVE" variant="green">
            {t('filters.active')}
          </FilterTag>
          <FilterTag searchParamKey="FILTER" value="ARCHIVED" variant="gray">
            {t('filters.archived')}
          </FilterTag>
        </div>
      </BottomSheet>
    </>
  );
}
