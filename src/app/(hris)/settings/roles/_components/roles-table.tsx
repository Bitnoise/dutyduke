'use client';

import { useTranslations } from 'next-intl';
import { Table, TableHeader, TableBody, Row, Cell, Column } from '@/lib/ui/components/table';
import { type RoleListItemDto } from '@/api/hris/authorization/infrastructure/controllers/roles.controller';
import { RoleItemMenu } from './role-item-menu';

type Props = {
  roles: RoleListItemDto[];
};

const ALL_ROLES_TABLE_COLUMNS = {
  name: {
    label: 'table.headers.name',
  },
  key: {
    label: 'table.headers.key',
  },
  assignedCount: {
    label: 'table.headers.assignedCount',
  },
};

export function RolesTable({ roles }: Props): JSX.Element {
  const t = useTranslations('settings.roles');

  return (
    <Table aria-label={t('title')}>
      <TableHeader columns={ALL_ROLES_TABLE_COLUMNS}>
        <Column />
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <Row key={role.id} id={role.id}>
            <Cell className="pl-4">{role.name}</Cell>
            <Cell>
              <span className="text-text-light-body text-xs">{role.key}</span>
            </Cell>
            <Cell>{role.assignedCount}</Cell>
            <Cell className="text-right">
              <RoleItemMenu role={role} />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
