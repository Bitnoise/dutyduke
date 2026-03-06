'use client';

import { Cell, Row, Table, TableBody, TableHeader, Column } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type Columns, type PropsWithClassName, cn } from '@/shared';
import { type DictionaryEntity } from '@/shared/types/dictionary';
import { DictionaryItemMenu } from './dictionary-item-menu';

const ALL_DICTIONARY_TABLE_COLUMNS: Columns = {
  name: {
    label: 'table.headers.name',
  },
};
type Props = {
  entities: DictionaryEntity[];
  onDelete(itemId: string): Promise<void>;
};

export function DictionaryTable({ className, entities, onDelete }: PropsWithClassName<Props>) {
  const { selectedItems, updateSelectedItems } = useSelectItems('DICTIONARY');

  return (
    <Table
      aria-label={'title'}
      className={cn(className)}
      selectedKeys={selectedItems}
      selectionMode={'multiple'}
      onSelectionChange={updateSelectedItems}
    >
      <TableHeader columns={ALL_DICTIONARY_TABLE_COLUMNS}>
        <Column />
      </TableHeader>
      <TableBody>
        {entities.map((item) => (
          <Row key={item.id} id={item.id}>
            <Cell className="text-left">{item.name}</Cell>
            <Cell className="text-right">
              <DictionaryItemMenu actions={['delete']} itemId={item.id} variant="small" onDelete={onDelete} />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
