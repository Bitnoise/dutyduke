'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type AssigneeDto, type EquipmentListWithAccessDto } from '@/api/hris/resources/model/dtos';
import { Avatar, Cell, Icon, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useColumns } from '@/lib/ui/hooks';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { HRIS_ROUTES, type Nullable, type PropsWithClassName, cn } from '@/shared';
import { ALL_EQUIPMENT_TABLE_COLUMNS } from '@/app/(hris)/company/equipment/_constants';

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

export function AssignEquipmentTable({
  className,
  equipments,
  navigationEnabled,
}: PropsWithClassName<Props>) {
  const {
    items,
    _access: { columns, actions },
  } = equipments;
  const t = useTranslations('company.equipment');
  const tNext = useNextTranslations('company.equipment');

  const columnsToShow = useColumns(ALL_EQUIPMENT_TABLE_COLUMNS, columns);
  const { selectedItems, updateSelectedItems } = useSelectItems('EQUIPMENT');

  return (
    <Table
      aria-label={tNext('title')}
      className={cn(className)}
      selectedKeys={selectedItems}
      selectionMode={actions.includes('select') ? 'multiple' : 'none'}
      onSelectionChange={updateSelectedItems}
    >
      <TableHeader columns={columnsToShow} />
      <TableBody>
        {items.map((equipment) => (
          <Row
            key={equipment.id}
            className={cn({ 'text-text-disabled italic': equipment.status === 'ARCHIVED' })}
            href={navigationEnabled ? HRIS_ROUTES.equipment.general(equipment.id) : undefined}
            id={equipment.id}
          >
            {'signature' in columnsToShow && <Cell>{equipment.signature}</Cell>}
            {'name' in columnsToShow && (
              <Cell>
                <div className="max-w-[250px] truncate" title={equipment.name}>
                  {equipment.name}
                </div>
              </Cell>
            )}
            {'category' in columnsToShow && <Cell>{equipment.category}</Cell>}
            {'status' in columnsToShow && <Cell>{t(`statusLabels.${equipment.status.toLowerCase()}`)}</Cell>}
            {'assignee' in columnsToShow && <AssigneeCell assignee={equipment.assignee} />}
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
