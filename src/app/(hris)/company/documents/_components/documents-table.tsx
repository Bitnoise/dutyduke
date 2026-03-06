'use client';

import { type MouseEvent } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { type AssigneeDto } from '@/api/hris/resources/model/dtos';
import { Avatar, Badge, Cell, Column, Icon, NoResults, Row, Table, TableBody, TableHeader } from '@/lib/ui';
import { useBadge, useColumns } from '@/lib/ui/hooks';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type Nullable, type PropsWithClassName, cn, parseDate, API_ROUTES } from '@/shared';
import { type DocumentsListWithAccessDto } from '@/api/hris/documents/model/dtos';
import { type IconNames } from '@/lib/ui/icons';
import { ALL_DOCUMENTS_TABLE_COLUMNS, ICONS_MAP } from '../_constants';
import { DocumentsGridListItemMenu } from './documents-grid-list-item-menu';

type Props = {
  documents: DocumentsListWithAccessDto;
  navigationEnabled: boolean;
  includeAssignee?: boolean;
  dateFormat: string;
};

function AssigneeCell({
  assignee,
  onClick,
  className,
}: {
  assignee: Nullable<AssigneeDto>;
  onClick?: (e: MouseEvent) => void;
  className?: string;
}): JSX.Element {
  if (!assignee) {
    return (
      <Cell className={className} truncate={false}>
        <div className={className ? 'cursor-pointer' : undefined} onClick={onClick}>
          <Icon name="avatar-empty" />
        </div>
      </Cell>
    );
  }

  return (
    <Cell
      className={cn('flex items-center gap-x-2', className)}
      textValue={assignee.fullName}
      truncate={false}
    >
      <div
        className={cn('flex items-center gap-x-2', {
          'cursor-pointer': !!onClick,
        })}
        onClick={onClick}
      >
        <Avatar avatarId={assignee.avatarId} size="sm" />
        <span>{assignee.fullName}</span>
      </div>
    </Cell>
  );
}

export function DocumentsTable({
  className,
  documents,
  includeAssignee = true,
  dateFormat,
}: PropsWithClassName<Props>) {
  const {
    items,
    _access: { columns, actions },
  } = documents;
  const tNext = useNextTranslations('company.documents');

  const columnsToShow = useColumns(
    ALL_DOCUMENTS_TABLE_COLUMNS,
    includeAssignee ? columns : columns.filter((col) => col !== 'assignedTo'),
  );
  const { selectedItems, updateSelectedItems } = useSelectItems('DOCUMENTS');
  const getBadge = useBadge();

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
        {items.map((document) => {
          const iconName = ((typeof document.assignedTo === 'string' &&
            ICONS_MAP[document.assignedTo.toLowerCase() as keyof typeof ICONS_MAP]) ??
            'avatar-empty') as IconNames;
          return (
            <Row
              key={document.id}
              className={cn({ 'text-text-disabled italic': document.status.includes('ARCHIVED') })}
              id={document.id}
            >
              {'description' in columnsToShow && (
                <Cell className="min-w-80 max-w-0 truncate">
                  <div
                    className={actions.includes('open') ? 'cursor-pointer' : undefined}
                    onClick={(e) => handleCellClick(document.id, e)}
                  >
                    {document.description}
                  </div>
                </Cell>
              )}
              {'extension' in columnsToShow && (
                <Cell className="w-20" truncate={false}>
                  <div
                    className={actions.includes('open') ? 'cursor-pointer' : undefined}
                    onClick={(e) => handleCellClick(document.id, e)}
                  >
                    .{document.extension}
                  </div>
                </Cell>
              )}
              {'category' in columnsToShow && (
                <Cell>
                  <div
                    className={actions.includes('open') ? 'cursor-pointer' : undefined}
                    onClick={(e) => handleCellClick(document.id, e)}
                  >
                    {document.category}
                  </div>
                </Cell>
              )}
              {'createdAt' in columnsToShow && (
                <Cell>
                  <div
                    className={actions.includes('open') ? 'cursor-pointer' : undefined}
                    onClick={(e) => handleCellClick(document.id, e)}
                  >
                    {parseDate(document.createdAt, dateFormat)}
                  </div>
                </Cell>
              )}
              {'expDate' in columnsToShow && (
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
              )}
              {includeAssignee &&
                'assignedTo' in columnsToShow &&
                document &&
                (typeof document.assignedTo === 'string' ? (
                  <Cell truncate={false}>
                    <div
                      className={cn('flex items-center gap-x-2', {
                        'cursor-pointer': actions.includes('open'),
                      })}
                      onClick={(e) => handleCellClick(document.id, e)}
                    >
                      <Icon name={iconName} />
                      {iconName !== 'avatar-empty' && <span>{document.assignedTo}</span>}
                    </div>
                  </Cell>
                ) : (
                  <AssigneeCell
                    assignee={document.assignedTo}
                    className={actions.includes('open') ? 'cursor-pointer' : undefined}
                    onClick={(e) => handleCellClick(document.id, e)}
                  />
                ))}
              <Cell className="text-right">
                <DocumentsGridListItemMenu
                  actions={actions}
                  documentId={document.id}
                  isAssigned={!!document.assignedTo}
                  variant="small"
                />
              </Cell>
            </Row>
          );
        })}
      </TableBody>
    </Table>
  );
}
