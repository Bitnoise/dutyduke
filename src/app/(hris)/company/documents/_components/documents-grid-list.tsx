'use client';

import { type MouseEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Avatar, Badge, BottomSheet, Button, GridList, GridListHeader, GridListItem, Icon } from '@/lib/ui';
import { cn, parseDate, type OrderBy, type PropsWithClassName, API_ROUTES } from '@/shared';
import { useBadge, useColumns, useModal } from '@/lib/ui/hooks';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { type DocumentsListWithAccessDto } from '@/api/hris/documents/model/dtos';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type IconNames } from '@/lib/ui/icons';
import { ALL_DOCUMENTS_TABLE_COLUMNS, ICONS_MAP } from '../_constants';
import { DocumentsFilters } from './documents-filters';
import { DocumentsBulkActions } from './documents-bulk-actions';
import { DocumentsGridListItemMenu } from './documents-grid-list-item-menu';

type Props = {
  documents: DocumentsListWithAccessDto;
  categories: Item[];
  navigationEnabled: boolean;
  assignedFiltersEnabled?: boolean;
  includeAssignee?: boolean;
  selectionMode?: 'multiple' | 'single' | 'none';
  disableActions?: boolean;
  dateFormat: string;
};

const SORT_KEYS = [
  { key: 'description-asc' },
  { key: 'description-desc' },
  { key: 'expDate-asc' },
  { key: 'expDate-desc' },
] as Array<{ key: OrderBy }>;

export function DocumentsGridList({
  documents,
  categories,
  className,
  assignedFiltersEnabled = true,
  includeAssignee = true,
  disableActions = false,
  selectionMode = 'multiple',
  dateFormat,
}: PropsWithClassName<Props>): JSX.Element {
  const {
    items,
    _access: { columns, actions },
  } = documents;

  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const columnsToShow = useColumns(
    ALL_DOCUMENTS_TABLE_COLUMNS,
    includeAssignee ? columns : columns.filter((col) => col !== 'assignedTo'),
  );
  const t = useTranslations('company.documents');
  const tNext = useNextTranslations('company.documents');
  const searchParams = useSearchParams();
  const { selectedItems } = useSelectItems('DOCUMENTS');
  const getBadge = useBadge();

  const category = searchParams.get('category') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const filter = searchParams.get('filter') ?? undefined;

  const handleContentClick = (documentId: string, event: MouseEvent) => {
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
    <>
      <GridListHeader
        className={cn(className, 'border-b border-b-divider')}
        searchParamKey="DOCUMENTS"
        selectionMode={actions.includes('select') ? selectionMode : undefined}
        sortKeys={disableActions ? undefined : SORT_KEYS}
      >
        {!disableActions && actions.includes('filter') && (
          <Button icon="filter" intent="tertiary" onClick={openModal} />
        )}
        {!disableActions && (
          <div className="ml-auto">
            <DocumentsBulkActions
              actions={actions}
              category={category}
              documentsIds={selectedItems}
              filter={filter}
              status={status}
              variant="small"
            />
          </div>
        )}
      </GridListHeader>
      <GridList
        aria-label={tNext('title')}
        className={cn(className)}
        searchParamKey="DOCUMENTS"
        selectionMode={actions.includes('select') ? selectionMode : 'none'}
      >
        {items.map((document) => (
          <GridListItem
            key={document.id}
            className="border-b border-b-divider py-2"
            id={document.id}
            textValue={`${document.id} ${document.description}`}
          >
            <div
              className={cn('flex flex-col', {
                'cursor-pointer': actions.includes('open'),
              })}
              onClick={(e) => handleContentClick(document.id, e)}
            >
              <div className="flex gap-x-3">
                {'description' in columnsToShow && (
                  <span className="line-clamp-1 min-w-0 break-all text-sm">{document.description}</span>
                )}
              </div>
              <div className="text-text-light-body flex text-xs">
                {'extension' in columnsToShow && (
                  <span className="mr-4 whitespace-nowrap text-xxs">{document.extension}</span>
                )}
                {'expDate' in columnsToShow && (
                  <span className="mr-4 whitespace-nowrap text-xxs">{`${t('expiration')}: ${document.expDate ? parseDate(document.expDate, dateFormat) : '-'}`}</span>
                )}
                {includeAssignee && 'assignedTo' in columnsToShow && document.assignedTo && (
                  <span className="max-w-28 truncate whitespace-nowrap text-xxs md:max-w-full">
                    {typeof document.assignedTo === 'string'
                      ? (document.assignedTo ?? '-')
                      : `${document.assignedTo?.fullName}`}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-x-2.5">
              <Badge intent={getBadge(document.expDate)} />
              {includeAssignee &&
                'assignedTo' in columnsToShow &&
                document &&
                (typeof document.assignedTo === 'string' ? (
                  <Icon
                    name={
                      (ICONS_MAP[document.assignedTo.toLowerCase() as keyof typeof ICONS_MAP] as IconNames) ??
                      'avatar-empty'
                    }
                  />
                ) : 'avatarId' in (document.assignedTo ?? {}) ? (
                  <Avatar avatarId={document.assignedTo?.avatarId ?? null} size="sm" />
                ) : (
                  <Icon name="avatar-empty" />
                ))}
              {!disableActions && (
                <DocumentsGridListItemMenu
                  actions={actions}
                  documentId={document.id}
                  isAssigned={!!document.assignedTo}
                  variant="small"
                />
              )}
            </div>
          </GridListItem>
        ))}
      </GridList>
      {categories && (
        <BottomSheet isOpen={isOpen} label={t('filters.title')} onClose={closeModal} onOpenChange={setIsOpen}>
          <DocumentsFilters assignedFiltersEnabled={assignedFiltersEnabled} categories={categories} />
        </BottomSheet>
      )}
    </>
  );
}
