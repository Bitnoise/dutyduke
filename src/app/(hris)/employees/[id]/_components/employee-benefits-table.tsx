'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { type EmployeeBenefitListWithAccessDto } from '@/api/hris/benefits/model/dtos';
import { Cell, Column, NoResults, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useColumns } from '@/lib/ui/hooks';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type CUID, type PropsWithClassName, cn, parseDate } from '@/shared';
import { EMPLOYEE_BENEFITS_TABLE_COLUMNS } from '@/app/(hris)/_constants';
import { EmployeeBenefitsItemMenu } from './employee-benefits-item-menu';

type Props = {
  benefits: EmployeeBenefitListWithAccessDto;
  navigationEnabled: boolean;
  employeeId: CUID;
  dateFormat: string;
};

export function EmployeeBenefitsTable({
  className,
  benefits,
  employeeId,
  dateFormat,
}: PropsWithClassName<Props>) {
  const {
    items,
    _access: { columns, actions },
  } = benefits;
  const tNext = useNextTranslations('company.benefits');

  // Reorder columns to match EMPLOYEE_BENEFITS_TABLE_COLUMNS definition order
  const columnsSet = new Set(columns as string[]);
  const orderedColumns = (
    Object.keys(EMPLOYEE_BENEFITS_TABLE_COLUMNS) as Array<keyof typeof EMPLOYEE_BENEFITS_TABLE_COLUMNS>
  ).filter((key) => columnsSet.has(key));

  const columnsToShow = useColumns(EMPLOYEE_BENEFITS_TABLE_COLUMNS, orderedColumns);

  const { selectedItems, updateSelectedItems } = useSelectItems('BENEFIT');

  return (
    <Table
      aria-label={tNext('title')}
      className={cn(className)}
      selectedKeys={selectedItems}
      selectionMode={actions.includes('select') ? 'multiple' : 'none'}
      onSelectionChange={updateSelectedItems}
    >
      <TableHeader columns={columnsToShow}>
        <Column />
      </TableHeader>
      <TableBody renderEmptyState={() => <NoResults />}>
        {items.map((benefit) => (
          <Row key={benefit.id} id={benefit.id}>
            {'benefit' in columnsToShow && <Cell>{benefit.benefit.name}</Cell>}
            {'startDate' in columnsToShow && <Cell>{parseDate(benefit.startDate, dateFormat)}</Cell>}
            <Cell className="text-right">
              <EmployeeBenefitsItemMenu
                actions={actions}
                employeeBenefitId={benefit.id}
                employeeId={employeeId}
                variant="small"
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
