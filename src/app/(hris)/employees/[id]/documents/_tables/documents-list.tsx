'use client';

import { type MouseEvent } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { cn, type OrderBy, type DocumentListActions, parseDate, API_ROUTES } from '@/shared';
import { GridList, GridListHeader, GridListItem } from '@/lib/ui';
import { DocumentItemMenu } from '@/app/(hris)/employees/[id]/documents/_components/document-item-menu';
import { type EmployeeDocumentsWithAccessDto } from '@/api/hris/employees/model/dtos';
import { ACTIONS } from '@/shared/constants/table-actions';

type Props = {
  documents: EmployeeDocumentsWithAccessDto;
  isDisabled?: boolean;
  employeeId: string;
  isMobile: boolean;
  className: string;
  dateFormat: string;
};

const ALLOWED_ACTIONS: DocumentListActions[] = ['edit', 'open'];

const SORT_KEYS = [
  { key: 'description-asc' },
  { key: 'description-desc' },
  { key: 'expDate-asc' },
  { key: 'expDate-desc' },
] as Array<{ key: OrderBy }>;

export function DocumentsList({
  documents,
  isDisabled,
  employeeId,
  className,
  dateFormat,
}: Props): JSX.Element {
  const {
    items,
    _access: { actions },
  } = documents;
  const tNext = useNextTranslations();

  const allowedActions = ALLOWED_ACTIONS.filter((action) => actions.includes(action)).map(
    (action) => ACTIONS[action],
  );

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
    <div className="flex flex-col gap-y-5 xl:hidden">
      <GridListHeader
        className={cn(className)}
        searchParamKey="DOCUMENTS"
        selectionMode={isDisabled ? undefined : 'multiple'}
        sortKeys={SORT_KEYS}
      ></GridListHeader>
      <GridList
        aria-label={tNext('documents.table')}
        className={cn(className)}
        searchParamKey="DOCUMENTS"
        selectionMode={isDisabled ? undefined : 'multiple'}
      >
        {items.map((document, index) => (
          <GridListItem
            key={document.id}
            className={cn('border-b border-divider py-2', {
              'border-y': index === 0,
            })}
            id={document.id}
            textValue={`${document.description}`}
          >
            <div
              className={cn('flex flex-col', {
                'cursor-pointer': actions.includes('open'),
              })}
              onClick={(e) => handleContentClick(document.id, e)}
            >
              <p className="max-w-60 truncate md:max-w-full">{document.description}</p>
              <p className="text-xxs">{parseDate(document.expDate, dateFormat)}</p>
            </div>
            <div className="ml-auto">
              <DocumentItemMenu actions={allowedActions} document={document} employeeId={employeeId} />
            </div>
          </GridListItem>
        ))}
      </GridList>
    </div>
  );
}
