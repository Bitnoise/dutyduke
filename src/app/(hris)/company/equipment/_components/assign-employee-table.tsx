'use client';

import { type TableProps } from 'react-aria-components';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeeListDto } from '@/api/hris/employees/model/dtos';
import { cn, type PropsWithClassName, type Columns } from '@/shared';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';

import { useColumns } from '@/lib/ui/hooks';
import { Table, TableHeader, TableBody, Row, Cell } from '@/lib/ui';

export const ASSIGN_EMPLOYEE_TABLE_COLUMNS: Columns = {
  lastName: {
    label: 'table.headers.lastName',
    sortKey: 'lastName',
  },
  firstName: {
    label: 'table.headers.firstName',
    sortKey: 'firstName',
  },
  role: { label: 'table.headers.role' },
  status: {
    label: 'table.headers.status',
  },
};

type Props = {
  data: EmployeeListDto;
  isNavigationEnabled?: boolean;
} & TableProps;

export function AssignEmployeeTable({
  data,
  selectionMode,
  ...rest
}: PropsWithClassName<Props>): JSX.Element {
  const {
    items,
    _access: { columns },
  } = data;
  const t = useTranslations();
  const { selectedItems, updateSelectedItems } = useSelectItems('EMPLOYEES');
  const columnsToShow = useColumns(ASSIGN_EMPLOYEE_TABLE_COLUMNS, columns);

  return (
    <Table
      selectedKeys={selectedItems}
      selectionMode={selectionMode}
      onSelectionChange={updateSelectedItems}
      {...rest}
    >
      <TableHeader columns={columnsToShow} />
      <TableBody>
        {items.map((employee) => (
          <Row
            key={employee.id}
            className={cn({
              'italic text-text-disabled': employee.status === 'ARCHIVED',
            })}
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
            {'status' in columnsToShow && (
              <Cell>{t(`employees.statuses.${employee.status.toLowerCase()}`)}</Cell>
            )}
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
