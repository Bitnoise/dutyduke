'use client';

import { type TableProps } from 'react-aria-components';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeeListDto } from '@/api/hris/employees/model/dtos';
import { cn, HRIS_ROUTES, type PropsWithClassName, type Columns } from '@/shared';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';

import { useColumns } from '@/lib/ui/hooks';
import { Table, TableHeader, TableBody, Column, Row, Cell } from '@/lib/ui';
import { EmployeeItemMenu } from '../[id]/_components/employee-item-menu';

export const ALL_EMPLOYEE_TABLE_COLUMNS: Columns = {
  lastName: {
    label: 'table.headers.lastName',
    sortKey: 'lastName',
    widthPx: 150,
  },
  firstName: {
    label: 'table.headers.firstName',
    sortKey: 'firstName',
    widthPx: 200,
  },
  role: { label: 'table.headers.role', widthPx: 150 },
  phone: {
    label: 'table.headers.phone',
    widthPx: 150,
  },
  workEmail: {
    label: 'table.headers.email',
    flex: 1,
  },
  status: {
    label: 'table.headers.status',
    widthPx: 100,
  },
};

type Props = {
  data: EmployeeListDto;
  isNavigationEnabled?: boolean;
} & TableProps;

export function EmployeesTable({
  data,
  isNavigationEnabled,
  selectionMode,
  ...rest
}: PropsWithClassName<Props>): JSX.Element {
  const {
    items,
    _access: { columns, actions },
  } = data;

  const t = useTranslations();
  const { selectedItems, updateSelectedItems } = useSelectItems('EMPLOYEES');
  const columnsToShow = useColumns(ALL_EMPLOYEE_TABLE_COLUMNS, columns);

  return (
    <Table
      selectedKeys={selectedItems}
      selectionMode={selectionMode}
      onSelectionChange={updateSelectedItems}
      {...rest}
    >
      <TableHeader columns={columnsToShow}>
        <Column />
      </TableHeader>
      <TableBody>
        {items.map((employee) => (
          <Row
            key={employee.id}
            className={cn({
              'italic text-text-disabled': employee.status === 'ARCHIVED',
            })}
            href={isNavigationEnabled ? HRIS_ROUTES.employees.general.base(employee.id) : undefined}
            id={employee.id}
          >
            {'lastName' in columnsToShow && (
              <Cell
                className={cn({
                  'pl-4': !selectionMode,
                })}
              >
                {employee.lastName}
              </Cell>
            )}
            {'firstName' in columnsToShow && <Cell>{employee.firstName}</Cell>}
            {'role' in columnsToShow && <Cell>{employee.role}</Cell>}
            {'phone' in columnsToShow && <Cell>{employee.phone}</Cell>}
            {'workEmail' in columnsToShow && <Cell>{employee.workEmail}</Cell>}
            {'status' in columnsToShow && (
              <Cell>{t(`employees.statuses.${employee.status.toLowerCase()}`)}</Cell>
            )}
            <Cell className="text-right">
              <EmployeeItemMenu actions={actions} employee={employee} variant="small" />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
