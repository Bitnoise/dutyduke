'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, ComboBox, Form, FormControl, TextArea } from '@/lib/ui';
import { capitalizeFirstLetter, type CUID } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { EQUIPMENT_STATUS } from '../_constants';
import { updateEquipmentStatus } from '../_actions';

type Props = {
  equipmentIds: CUID[] | 'all';
  category?: string;
  filter?: string;
  status?: string;
};

export function UpdateEquipmentStatusForm({ equipmentIds, category, filter, status }: Props) {
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations();

  const equipmentStatusItems = EQUIPMENT_STATUS.reduce<Item[]>(
    (acc, curr) => [...acc, { key: curr, label: capitalizeFirstLetter(curr.replace('_', ' ')) }],
    [],
  );

  const handleSuccess = () => {
    router.back();
    toast(EQUIPMENT_TOASTS.UPDATE);
  };

  return (
    <Form
      action={updateEquipmentStatus}
      className="flex flex-col gap-y-6 pb-4 pt-6"
      defaultState={{
        status: 'idle',
        form: {
          equipmentIds,
          status: 'WORKING',
          filterStatus: status ?? null,
          filterCategory: category ?? null,
          filter: filter ?? null,
          description: '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <>
          <FormControl errors={errors} name="status">
            {(controlState) => (
              <ComboBox
                className="w-full"
                items={equipmentStatusItems}
                label={t('forms.status')}
                selectionMode="single"
                {...controlState}
              />
            )}
          </FormControl>
          <FormControl name="description">
            {(formState) => <TextArea autoFocus label={t('forms.description')} {...formState} />}
          </FormControl>
          <div className="flex justify-end gap-x-4">
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
            <FormControl>
              {({ isSubmitting }) => (
                <Button icon="ok" intent="primary" isLoading={isSubmitting} type="submit">
                  {t('ctaLabels.confirmChange')}
                </Button>
              )}
            </FormControl>
          </div>
        </>
      )}
    </Form>
  );
}
