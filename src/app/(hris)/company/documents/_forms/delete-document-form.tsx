'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl } from '@/lib/ui';
import { deleteDocuments } from '../_actions';

type Props = {
  documentIds: 'all' | string[];
  assignmentFilter?: string;
  filterCategory?: string;
  filterStatus?: string;
};

export function DeleteDocumentsForm({
  documentIds,
  assignmentFilter,
  filterStatus,
  filterCategory,
}: Props): JSX.Element {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Form
      focusInputOnError
      action={deleteDocuments}
      className="flex flex-1 flex-col"
      defaultState={{
        status: 'idle',
        form: {
          documents: documentIds,
          filter: assignmentFilter,
          filterCategory,
          filterStatus,
        },
      }}
      onSuccess={() => router.back()}
    >
      {() => (
        <FormControl>
          {({ isSubmitting }) => (
            <div className="flex justify-end gap-4 pt-4">
              <Button
                icon="trash"
                intent="danger"
                isDisabled={!documentIds.length}
                isLoading={isSubmitting}
                type="submit"
              >
                {t('ctaLabels.delete')}
              </Button>
              <Button
                icon="close"
                intent="secondary"
                isLoading={isSubmitting}
                type="button"
                onClick={() => router.back()}
              >
                {t('ctaLabels.goBack')}
              </Button>
            </div>
          )}
        </FormControl>
      )}
    </Form>
  );
}
