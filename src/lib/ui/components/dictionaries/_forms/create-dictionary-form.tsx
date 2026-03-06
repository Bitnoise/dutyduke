'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl, TextInput } from '@/lib/ui';
import { type CreateDictionaryEntityActionState } from '@/shared/types/dictionary';
import { useToast } from '@/lib/ui/hooks';
import { DICTIONARY_TOASTS } from '@/shared/constants/toast-notifications';

type Props = {
  dictionaryName: string;
  onClose: () => void;
  action: (
    prevState: CreateDictionaryEntityActionState,
    formData: FormData,
    dictionaryName: string,
  ) => Promise<CreateDictionaryEntityActionState>;
};

export function CreateDictionaryForm({ dictionaryName, onClose, action }: Props) {
  const t = useTranslations('dictionaries.' + dictionaryName);
  const toast = useToast();

  const handleSuccess = () => {
    toast(DICTIONARY_TOASTS.CREATE);
    onClose();
  };
  return (
    <Form
      focusInputOnError
      action={action}
      className="flex flex-col gap-y-6"
      defaultState={{ status: 'idle', form: { name: '' } }}
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <>
          <FormControl errors={errors} name="name">
            {(formState) => <TextInput autoFocus isRequired label={t('forms.name')} {...formState} />}
          </FormControl>
          <div className="flex items-end justify-end gap-x-4">
            <Button
              className="w-full md:w-fit"
              icon="close"
              intent="tertiary"
              type="button"
              onClick={onClose}
            >
              {t('cancel')}
            </Button>
            <Button className="w-full md:w-fit" icon="ok" intent="primary" type="submit">
              {t('save')}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
