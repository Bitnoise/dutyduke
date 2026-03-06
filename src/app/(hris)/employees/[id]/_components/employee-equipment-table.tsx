'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EquipmentListWithAccessDto } from '@/api/hris/resources/model/dtos';
import { Cell, Column, NoResults, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useColumns } from '@/lib/ui/hooks';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type CUID, HRIS_ROUTES, type PropsWithClassName, cn } from '@/shared';
import { EMPLOYEE_EQUIPMENT_TABLE_COLUMNS } from '@/app/(hris)/_constants';
import { EmployeeEquipmentItemMenu } from './employee-equipment-item-menu';

type Props = {
  equipments: EquipmentListWithAccessDto;
  navigationEnabled: boolean;
  includeAssignee?: boolean;
  employeeId: CUID;
  filter?: string;
  category?: string;
  status?: string;
};

export function EmployeeEquipmentTable({
  className,
  equipments,
  navigationEnabled,
  includeAssignee = true,
  category,
  status,
  filter,
  employeeId,
}: PropsWithClassName<Props>) {
  const {
    items,
    _access: { columns, actions },
  } = equipments;
  const t = useTranslations('company.equipment');
  const tNext = useNextTranslations('company.equipment');

  const columnsToShow = useColumns(
    EMPLOYEE_EQUIPMENT_TABLE_COLUMNS,
    includeAssignee ? columns : columns.filter((col) => col !== 'assignee'),
  );
  const { selectedItems, updateSelectedItems } = useSelectItems('EQUIPMENT');

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
        {items.map((equipment) => (
          <Row
            key={equipment.id}
            className={cn({
              'italic text-text-disabled': equipment.status === 'ARCHIVED',
              'italic text-warning': equipment.status === 'BROKEN',
            })}
            href={navigationEnabled ? HRIS_ROUTES.equipment.general(equipment.id) : undefined}
            id={equipment.id}
          >
            {'signature' in columnsToShow && (
              <Cell className="max-w-0 truncate text-nowrap pr-2">{equipment.signature}</Cell>
            )}
            {'name' in columnsToShow && <Cell>{equipment.name}</Cell>}
            {'category' in columnsToShow && <Cell>{equipment.category}</Cell>}

            {'status' in columnsToShow && <Cell>{t(`statusLabels.${equipment.status.toLowerCase()}`)}</Cell>}
            <Cell className="text-right">
              <EmployeeEquipmentItemMenu
                actions={actions}
                category={category}
                employeeId={employeeId}
                equipmentId={equipment.id}
                filter={filter}
                status={status}
                variant="small"
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
