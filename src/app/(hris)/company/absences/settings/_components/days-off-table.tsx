'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { type AbsenceDTO, type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type WithAccess, type Columns, type Paginated, type PropsWithClassName, cn } from '@/shared';
import { DaysOffMenu } from './days-off-menu';

type AbsenceItem = Pick<AbsenceDTO, 'id' | 'description'> & {
  dateRange: string;
};

type Props = {
  absences: WithAccess<Paginated<AbsenceItem>, { actions: AbsenceAction[] }>;
};

export const ALL_ABSENCE_TABLE_COLUMNS: Columns = {
  dateRange: {
    label: 'table.headers.dateRange',
  },
  status: {
    label: 'table.headers.description',
  },
};

export function DaysOffTable({ absences, className }: PropsWithClassName<Props>) {
  const {
    items,
    _access: { actions },
  } = absences;
  const tNext = useNextTranslations('absences');
  const { selectedItems, updateSelectedItems } = useSelectItems('ABSENCES');

  return (
    <Table
      aria-label={tNext('header')}
      className={cn(className)}
      selectedKeys={selectedItems}
      selectionMode={actions.includes('select') ? 'multiple' : 'none'}
      onSelectionChange={updateSelectedItems}
    >
      <TableHeader columns={ALL_ABSENCE_TABLE_COLUMNS}>
        <Column />
      </TableHeader>
      <TableBody>
        {items.map((absence) => (
          <Row key={absence.id} id={absence.id}>
            <Cell>{absence.dateRange}</Cell>
            <Cell>{absence.description}</Cell>
            <Cell className="text-right">
              <DaysOffMenu absenceIds={[absence.id]} actions={actions} />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
