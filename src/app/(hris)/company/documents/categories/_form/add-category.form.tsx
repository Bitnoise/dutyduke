'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl, TextInput } from '@/lib/ui';
import { Stack } from '@/lib/ui/components/stack';
import { useToast } from '@/lib/ui/hooks';
import { DOCUMENTS_CATEGORY_TOASTS } from '@/shared/constants/toast-notifications';
import { addCategory } from '../_actions/add-category.action';

type Props = {
  onCancel(): void;
};

export function AddCategoryForm({ onCancel }: Props) {
  const toast = useToast();
  const t = useTranslations('company.documents.categories.add');

  const handleSuccess = () => {
    toast(DOCUMENTS_CATEGORY_TOASTS.CREATE);
    onCancel();
  };

  return (
    <Form
      action={addCategory}
      className="pt-6"
      defaultState={{
        status: 'idle',
        form: {
          name: '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {(form, errors) => (
        <Stack direction="column" gapY="1.5rem">
          <FormControl errors={errors} name="name">
            {(control) => <TextInput autoFocus defaultValue={form.name} label={t('name')} {...control} />}
          </FormControl>
          <FormControl>
            {({ isSubmitting }) => (
              <Stack className="self-end">
                <Button
                  icon="close"
                  intent="tertiary"
                  isLoading={isSubmitting}
                  type="button"
                  onClick={onCancel}
                >
                  {t('cancel')}
                </Button>
                <Button icon="ok" isLoading={isSubmitting} type="submit">
                  {t('save')}
                </Button>
              </Stack>
            )}
          </FormControl>
        </Stack>
      )}
    </Form>
  );
}
