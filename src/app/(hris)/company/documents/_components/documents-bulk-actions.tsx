'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Icon } from '@/lib/ui';
import { useSelectItems } from '@/lib/ui/hooks/useSelectItems';
import { type DocumentListActions, HRIS_ROUTES } from '@/shared';
import { Menu, MenuItem } from '@/lib/ui/components/menu';

type Props = {
  documentsIds?: 'all' | string[];
  variant?: 'small' | 'default';
  actions: DocumentListActions[];
  status?: string;
  category?: string;
  filter?: string;
};

export function DocumentsBulkActions({
  actions,
  variant = 'default',
  documentsIds,
  category,
  status,
  filter,
}: Props) {
  const t = useTranslations('ctaLabels');
  const router = useRouter();
  const { selectedItems } = useSelectItems('DOCUMENTS');

  const parsedDocumentIds = documentsIds === 'all' ? 'all' : documentsIds ? documentsIds.join(',') : '';

  if (variant === 'small') {
    return (
      <div className="flex gap-x-2.5">
        {selectedItems.length > 0 ? (
          <>
            <Menu
              trigger={
                <Button icon="context" intent="tertiary" size="sm">
                  Actions
                </Button>
              }
            >
              {actions.includes('edit') && (
                <MenuItem
                  className="flex items-center gap-x-2.5"
                  onAction={() =>
                    router.push(HRIS_ROUTES.documents.edit(parsedDocumentIds, category, status, filter))
                  }
                >
                  <Icon name="edit-2" size="xs" />
                  <span>{t('edit')}</span>
                </MenuItem>
              )}
              {actions.includes('delete') && (
                <MenuItem
                  className="flex items-center gap-x-2.5 text-warning"
                  onAction={() =>
                    router.push(
                      HRIS_ROUTES.documents.delete(parsedDocumentIds ?? '', category, status, filter),
                    )
                  }
                >
                  <Icon name="trash" size="xs" />
                  <span>{t('delete')}</span>
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          actions.includes('addFile') && (
            <Button icon="upload" onClick={() => router.push(HRIS_ROUTES.documents.add)} />
          )
        )}
      </div>
    );
  }

  return (
    <div className="hidden xl:block">
      {selectedItems.length > 0
        ? actions.includes('edit') && (
            <div className="flex gap-2">
              <Button
                icon="edit-2"
                onClick={() =>
                  router.push(HRIS_ROUTES.documents.edit(parsedDocumentIds, category, status, filter))
                }
              >
                {t('edit')}
              </Button>
              <Button
                icon="trash"
                intent="danger"
                onClick={() =>
                  router.push(HRIS_ROUTES.documents.delete(parsedDocumentIds ?? '', category, status, filter))
                }
              >
                {t('delete')}
              </Button>
            </div>
          )
        : actions.includes('delete') && (
            <Button icon="upload" onClick={() => router.push(HRIS_ROUTES.documents.add)}>
              {t('addFile')}
            </Button>
          )}
    </div>
  );
}
