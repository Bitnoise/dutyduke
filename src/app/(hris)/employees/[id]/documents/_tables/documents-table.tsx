'use client';

import { type MouseEvent } from 'react';
import { type TableProps } from 'react-aria-components';
import { type Columns, parseDate, API_ROUTES, cn } from '@/shared';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { useBadge, useColumns } from '@/lib/ui/hooks';
import { ACTIONS } from '@/shared/constants/table-actions';
import { type EmployeeAction, type EmployeeDocumentsWithAccessDto } from '@/api/hris/employees/model/dtos';
import { Badge, Cell, Column, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { DocumentItemMenu } from '../_components/document-item-menu';

type Props = {
  documents: EmployeeDocumentsWithAccessDto;
  employeeId: string;
  isMobile: boolean;
  dateFormat: string;
} & TableProps;

const ALLOWED_ACTIONS: EmployeeAction[] = ['edit', 'open', 'delete'];

const ALL_DOCUMENTS_TABLE_COLUMNS: Columns = {
  description: {
    label: 'table.headers.description',
    sortKey: 'description',
  },
  extension: {
    label: 'table.headers.extension',
  },
  expDate: {
    label: 'table.headers.expDate',
    sortKey: 'expDate',
  },
};

export function DocumentsTable({
  documents,
  employeeId,
  selectionMode,
  dateFormat,
  ...other
}: Props): JSX.Element {
  const {
    items,
    _access: { actions },
  } = documents;

  const { selectedItems, updateSelectedItems } = useSelectItems('DOCUMENTS');
  const columnsToShow = useColumns(ALL_DOCUMENTS_TABLE_COLUMNS, Object.keys(ALL_DOCUMENTS_TABLE_COLUMNS));
  const getBadge = useBadge();

  const allowedActions = ALLOWED_ACTIONS.filter((action) => actions.includes(action)).map(
    (action) => ACTIONS[action],
  );

  const handleCellClick = (documentId: string, event: MouseEvent) => {
    // Don't open if clicking on checkbox, menu button, or menu items
    const target = event.target as HTMLElement;
    if (
      target.closest('input[type="checkbox"]') ||
      target.closest('button') ||
      target.closest('[role="menuitem"]') ||
      target.closest('[role="menu"]')
    ) {
      return;
    }

    // Open document in new tab
    if (actions.includes('open')) {
      event.preventDefault();
      event.stopPropagation();
      window.open(API_ROUTES.documents.open(documentId), '_blank');
    }
  };

  return (
    <div className="hidden flex-col gap-y-5 xl:flex">
      <div className="min-h-96">
        <Table
          selectedKeys={selectedItems}
          selectionMode={selectionMode}
          onSelectionChange={updateSelectedItems}
          {...other}
        >
          <TableHeader columns={columnsToShow}>
            <Column />
          </TableHeader>
          <TableBody>
            {items.map((document) => (
              <Row key={document.id} id={document.id}>
                <Cell>
                  <div
                    className={actions.includes('open') ? 'cursor-pointer' : undefined}
                    onClick={(e) => handleCellClick(document.id, e)}
                  >
                    {document.description}
                  </div>
                </Cell>
                <Cell>
                  <div
                    className={actions.includes('open') ? 'cursor-pointer' : undefined}
                    onClick={(e) => handleCellClick(document.id, e)}
                  >
                    .{document.extension}
                  </div>
                </Cell>

                <Cell>
                  <div
                    className={cn('flex gap-2', {
                      'cursor-pointer': actions.includes('open'),
                    })}
                    onClick={(e) => handleCellClick(document.id, e)}
                  >
                    {document.expDate && (
                      <span className="basis-[110px]">{parseDate(document.expDate, dateFormat)}</span>
                    )}
                    <Badge intent={getBadge(document.expDate)} />
                  </div>
                </Cell>
                <Cell className="flex justify-end">
                  <DocumentItemMenu actions={allowedActions} document={document} employeeId={employeeId} />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
