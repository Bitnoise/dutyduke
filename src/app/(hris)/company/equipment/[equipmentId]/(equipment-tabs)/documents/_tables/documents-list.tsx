import { useTranslations as useNextTranslations } from 'next-intl';
import { cn, type OrderBy, type DocumentListActions, parseDate } from '@/shared';
import { GridList, GridListHeader, GridListItem } from '@/lib/ui';
import { ACTIONS } from '@/shared/constants/table-actions';
import { type EquipmentDocumentsWithAccessDto } from '@/api/hris/resources/model/dtos';
import { DocumentItemMenu } from '../_components';

type Props = {
  documents: EquipmentDocumentsWithAccessDto;
  isDisabled?: boolean;
  equipmentId: string;
  className: string;
  dateFormat: string;
};

const ALLOWED_ACTIONS: DocumentListActions[] = ['edit', 'open', 'delete'];

const SORT_KEYS: Array<{ key: OrderBy }> = [{ key: 'expDate-asc' }, { key: 'expDate-desc' }];

export function DocumentsList({
  documents,
  isDisabled,
  equipmentId,
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

  return (
    <div className="flex flex-col gap-y-5 xl:hidden">
      <GridListHeader
        className={cn(className)}
        searchParamKey="DOCUMENTS"
        selectionMode={isDisabled ? undefined : 'multiple'}
        sortKeys={SORT_KEYS}
      />
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
            <div className="flex flex-1 cursor-pointer flex-col">
              <div className="flex gap-x-3">
                <p>{document.description}</p>
              </div>
              <p className="text-text-light-body text-xxs">{parseDate(document.expDate, dateFormat)}</p>
            </div>
            <DocumentItemMenu actions={allowedActions} document={document} equipmentId={equipmentId} />
          </GridListItem>
        ))}
      </GridList>
    </div>
  );
}
