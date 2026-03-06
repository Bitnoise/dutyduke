'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl, TextArea } from '@/lib/ui';
import { type CUID } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';
import { archiveEquipment } from '../_actions';

type Props = {
  equipmentIds: CUID[] | 'all';
  category?: string;
  filter?: string;
  status?: string;
};

export function ArchiveEquipmentForm({ equipmentIds, category, filter, status }: Props) {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations();

  const handleSuccess = () => {
    router.back();
    toast(EQUIPMENT_TOASTS.UPDATE);
  };

  return (
    <Form
      action={archiveEquipment}
      className="flex flex-col gap-y-6 pb-4 pt-6"
      defaultState={{
        status: 'idle',
        form: {
          equipmentIds,
          filterStatus: status ?? null,
          filterCategory: category ?? null,
          filter: filter ?? null,
          description: '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {() => (
        <>
          <FormControl name="description">
            {(formState) => <TextArea autoFocus label={t('forms.description')} {...formState} />}
          </FormControl>
          <div className="flex justify-end gap-x-4">
            <FormControl>
              {({ isSubmitting }) => (
                <Button icon="trash" intent="danger" isLoading={isSubmitting} type="submit">
                  {t('ctaLabels.confirmArchive')}
                </Button>
              )}
            </FormControl>
            <FormControl>
              {({ isSubmitting }) => (
                <Button
                  icon="close"
                  intent="tertiary"
                  isDisabled={isSubmitting}
                  type="button"
                  onClick={router.back}
                >
                  {t('ctaLabels.no')}
                </Button>
              )}
            </FormControl>
          </div>
        </>
      )}
    </Form>
  );
}
