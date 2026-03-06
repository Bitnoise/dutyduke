'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { type AssigneeDto, type EquipmentListWithAccessDto } from '@/api/hris/resources/model/dtos';
import { Avatar, Cell, Column, Icon, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useColumns } from '@/lib/ui/hooks';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { HRIS_ROUTES, type Nullable, type PropsWithClassName, cn } from '@/shared';
import { ALL_EQUIPMENT_TABLE_COLUMNS } from '@/app/(hris)/company/equipment/_constants';
import { EquipmentItemMenu } from '@/app/(hris)/company/equipment/_components/equipment-item-menu';

type Props = {
  equipments: EquipmentListWithAccessDto;
  navigationEnabled: boolean;
  includeAssignee?: boolean;
};

function AssigneeCell({ assignee }: { assignee: Nullable<AssigneeDto> }): JSX.Element {
  if (!assignee) {
    return (
      <Cell truncate={false}>
        <Icon name="avatar-empty" />
      </Cell>
    );
  }

  return (
    <Cell className="flex items-center gap-x-2" textValue={assignee.fullName} truncate={false}>
      <Avatar avatarId={assignee.avatarId} size="sm" />
      <span>{assignee.fullName}</span>
    </Cell>
  );
}

export function EquipmentTable({
  className,
  equipments,
  navigationEnabled,
  includeAssignee = true,
}: PropsWithClassName<Props>) {
  const {
    items,
    _access: { columns, actions },
  } = equipments;
  const t = useNextTranslations('company.equipment');

  const columnsToShow = useColumns(
    ALL_EQUIPMENT_TABLE_COLUMNS,
    includeAssignee ? columns : columns.filter((col) => col !== 'assignee'),
  );
  const { selectedItems, updateSelectedItems } = useSelectItems('EQUIPMENT');

  return (
    <Table
      aria-label={t('title')}
      className={cn(className)}
      selectedKeys={selectedItems}
      selectionMode={actions.includes('select') ? 'multiple' : 'none'}
      onSelectionChange={updateSelectedItems}
    >
      <TableHeader columns={columnsToShow}>
        <Column />
      </TableHeader>
      <TableBody>
        {items.map((equipment) => (
          <Row
            key={equipment.id}
            className={cn({ 'text-text-disabled italic': equipment.status === 'ARCHIVED' })}
            href={navigationEnabled ? HRIS_ROUTES.equipment.general(equipment.id) : undefined}
            id={equipment.id}
          >
            {'name' in columnsToShow && <Cell>{equipment.name}</Cell>}
            {'signature' in columnsToShow && <Cell>{equipment.signature}</Cell>}
            {'category' in columnsToShow && <Cell>{equipment.category}</Cell>}
            {'status' in columnsToShow && <Cell>{t(`statusLabels.${equipment.status.toLowerCase()}`)}</Cell>}
            {includeAssignee && 'assignee' in columnsToShow && <AssigneeCell assignee={equipment.assignee} />}
            <Cell className="text-right">
              <EquipmentItemMenu
                actions={actions}
                equipmentId={equipment.id}
                isAssigned={!!equipment.assignee}
                variant="small"
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
