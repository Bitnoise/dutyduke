'use client';

import { useRouter } from 'next/navigation';
import { type GridListProps } from 'react-aria-components';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeeListDto } from '@/api/hris/employees/model/dtos';
import { GridList, GridListHeader, GridListItem } from '@/lib/ui/components/grid-list';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { cn, HRIS_ROUTES, type PropsWithClassName, type OrderBy, parseString } from '@/shared';
import { EmployeeBulkActionMenu } from '@/app/(hris)/employees/[id]/_components/employee-bulk-menu';
import { EmployeeItemMenu } from '@/app/(hris)/employees/[id]/_components/employee-item-menu';
import { BottomSheet, Button } from '@/lib/ui';
import { useModal } from '@/lib/ui/hooks';
import { FilterTag } from '@/lib/ui/components/filter-tag';

type Props<T> = {
  isNavigationEnabled?: boolean;
  data: EmployeeListDto;
} & GridListProps<T>;

const SORT_KEYS = [{ key: 'lastName-asc' }, { key: 'lastName-desc' }] as Array<{ key: OrderBy }>;

export function EmployeesGridList<T>({
  data,
  isNavigationEnabled,
  className,
}: PropsWithClassName<Props<T>>): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  const router = useRouter();
  const { selectedItems } = useSelectItems('EMPLOYEES');
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
        selectionMode={actions.includes('select') ? 'multiple' : undefined}
        sortKeys={SORT_KEYS}
      >
        <>
          {actions.includes('filter') && (
            <Button className="mr-auto" icon="filter" intent="tertiary" onClick={openModal} />
          )}
          {selectedItems.length > 0 && <EmployeeBulkActionMenu actions={actions} />}
          {actions.includes('create') && !selectedItems.length && (
            <Button icon="add" onClick={() => router.push(HRIS_ROUTES.employees.create)} />
          )}
        </>
      </GridListHeader>
      <GridList
        aria-label={tNext('employees.employeesList')}
        className={cn(className)}
        searchParamKey="EMPLOYEES"
        selectionMode={actions.includes('select') ? 'multiple' : undefined}
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
            <EmployeeItemMenu actions={actions} employee={employee} variant="small" />
          </GridListItem>
        ))}
      </GridList>
      <BottomSheet
        isOpen={isOpen}
        label={tNext('filters.filters')}
        onClose={closeModal}
        onOpenChange={setIsOpen}
      >
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
