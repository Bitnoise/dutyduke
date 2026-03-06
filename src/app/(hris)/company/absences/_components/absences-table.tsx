'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type AbsenceDTO, type AbsenceAction } from '@/api/hris/absences/model/dtos/absence.dto';
import { type BaseEmployeeDto } from '@/api/hris/employees/model/dtos';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import {
  parseDate,
  type WithAccess,
  type Columns,
  type Paginated,
  type PropsWithClassName,
  cn,
  type CUID,
} from '@/shared';
import { AbsencesMenu } from './absences-menu';

export type AbsenceItem = Pick<
  AbsenceDTO,
  'id' | 'requestedAt' | 'type' | 'status' | 'approvedAt' | 'rejectedAt' | 'description'
> & {
  dateRange: string;
  issuer: BaseEmployeeDto | null;
};

type Props = {
  absences: WithAccess<Paginated<AbsenceItem>, { actions: AbsenceAction[] }>;
  reviewerId: CUID;
  dateFormat: string;
};

export const ALL_ABSENCE_TABLE_COLUMNS: Columns = {
  lastName: {
    label: 'table.headers.lastName',
  },
  firstName: {
    label: 'table.headers.firstName',
  },
  dateRange: {
    label: 'table.headers.dateRange',
  },
  type: {
    label: 'table.headers.type',
    sortKey: 'type',
  },
  description: {
    label: 'table.headers.description',
  },
  requestedAt: {
    label: 'table.headers.requestedAt',
    sortKey: 'requestedAt',
  },
  status: {
    label: 'table.headers.status',
  },
};

export function AbsencesTable({ absences, className, reviewerId, dateFormat }: PropsWithClassName<Props>) {
  const {
    items,
    _access: { actions },
  } = absences;
  const t = useTranslations('absences');
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
            <Cell>{absence.issuer?.lastName ?? '—'}</Cell>
            <Cell truncate={false}>{absence.issuer?.firstName ?? '—'}</Cell>
            <Cell className="min-w-40">{absence.dateRange}</Cell>
            <Cell
              className={cn({
                'text-orange-800': absence.type === 'SICK',
                'text-green-800': absence.type === 'HOLIDAY',
                'text-blue-800': absence.type === 'PERSONAL',
              })}
            >
              {t(`type.${absence.type.toLowerCase()}`)}
            </Cell>
            <Cell className="max-w-[200px]">
              {absence.description ? (
                <span className="line-clamp-2 text-gray-600">{absence.description}</span>
              ) : (
                <span className="text-gray-600">—</span>
              )}
            </Cell>
            <Cell>{parseDate(absence.requestedAt, dateFormat)}</Cell>
            <Cell
              className={cn({
                'text-orange-800': absence.status === 'PENDING',
                'text-green-800': absence.status === 'APPROVED',
                'text-red-900': absence.status === 'REJECTED',
              })}
              truncate={false}
            >
              {t(`status.${absence.status.toLowerCase()}`)}
            </Cell>
            <Cell className="pr-0 text-right" truncate={false}>
              <AbsencesMenu
                absenceId={[absence.id]}
                actions={actions}
                approvedAt={absence.approvedAt}
                rejectedAt={absence.rejectedAt}
                reviewerId={reviewerId}
                status={absence.status}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
