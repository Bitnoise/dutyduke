'use client';

import { type TableProps } from 'react-aria-components';
import { type Columns, parseDate, parseString } from '@/shared';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { useColumns } from '@/lib/ui/hooks';
import { ACTIONS } from '@/shared/constants/table-actions';
import { type EmployeeAction } from '@/api/hris/employees/model/dtos';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { type EquipmentDocumentsWithAccessDto } from '@/api/hris/resources/model/dtos';
import { DocumentItemMenu } from '../_components';

type Props = {
  documents: EquipmentDocumentsWithAccessDto;
  equipmentId: string;
  isMobile: boolean;
  dateFormat: string;
} & TableProps;

const ALLOWED_ACTIONS: EmployeeAction[] = ['edit', 'open', 'delete'];

const ALL_DOCUMENTS_TABLE_COLUMNS: Columns = {
  description: {
    label: 'table.headers.description',
  },
  extension: {
    label: 'table.headers.extension',
  },
  expDate: {
    label: 'table.headers.expDate',
  },
};

export function DocumentsTable({
  documents,
  equipmentId,
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

  const allowedActions = ALLOWED_ACTIONS.filter((action) => actions.includes(action)).map(
    (action) => ACTIONS[action],
  );

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
                <Cell>{document.description}</Cell>
                <Cell>.{document.extension}</Cell>
                <Cell>{parseString(parseDate(document.expDate, dateFormat))}</Cell>
                <Cell className="flex justify-end">
                  <DocumentItemMenu actions={allowedActions} document={document} equipmentId={equipmentId} />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
