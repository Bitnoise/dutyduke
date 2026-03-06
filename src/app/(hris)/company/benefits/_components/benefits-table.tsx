'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { type BenefitListWithAccessDto } from '@/api/hris/benefits/model/dtos';
import { AvatarList, Cell, Column, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useColumns } from '@/lib/ui/hooks';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type PropsWithClassName, cn, parseDate } from '@/shared';
import { ALL_BENEFITS_TABLE_COLUMNS } from '@/app/(hris)/company/benefits/_constants';
import { BenefitsItemMenu } from '@/app/(hris)/company/benefits/_components/benefits-item-menu';

type Props = {
  benefits: BenefitListWithAccessDto;
  navigationEnabled: boolean;
  dateFormat: string;
};

export function BenefitsTable({ className, benefits, dateFormat }: PropsWithClassName<Props>) {
  const {
    items,
    _access: { columns, actions },
  } = benefits;
  const t = useNextTranslations('company.benefits');

  const columnsToShow = useColumns(ALL_BENEFITS_TABLE_COLUMNS, columns);
  const { selectedItems, updateSelectedItems } = useSelectItems('BENEFIT');

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
        {items.map((benefit) => (
          <Row key={benefit.id} id={benefit.id}>
            {'name' in columnsToShow && <Cell>{benefit.name}</Cell>}
            {'note' in columnsToShow && <Cell>{benefit.note ?? '-'}</Cell>}
            {'assignedEmployees' in columnsToShow && (
              <Cell>
                <AvatarList
                  users={benefit.assignedEmployees.map((emp) => ({
                    name: `${emp.firstName} ${emp.lastName}`,
                    avatarId: emp.avatarId,
                  }))}
                  visibleCount={6}
                />
              </Cell>
            )}
            {'createdAt' in columnsToShow && <Cell>{parseDate(benefit.createdAt, dateFormat)}</Cell>}
            <Cell className="text-right">
              <BenefitsItemMenu actions={actions} benefitId={benefit.id} variant="small" />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
