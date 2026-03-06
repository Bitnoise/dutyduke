'use client';
import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EditEmployeeDocumentSchema } from '@/app/(hris)/employees/[id]/documents/_schemas';
import { Button, DateField, Form, FormControl, TextInput } from '@/lib/ui';
import { type CUID, parseDate, type WithId } from '@/shared';
import { editEquipmentDocument } from '../_actions';

type Props = {
  equipmentId: CUID;
  document: WithId<EditEmployeeDocumentSchema>;
  dateFormat: string;
};

export function EditEquipmentDocumentForm({ document, equipmentId, dateFormat }: Props): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  const router = useRouter();

  return (
    <Form
      action={editEquipmentDocument}
      className="flex flex-col gap-y-5"
      defaultState={{
        status: 'idle',
        form: {
          equipmentId,
          documentId: document.id,
          description: document.description,
          expDate: parseDate(document.expDate, dateFormat),
        },
      }}
      onSuccess={router.back}
    >
      {(form, errors) => (
        <>
          <FormControl errors={errors} name="description">
            {({ name, isInvalid, isSubmitting, errorMessage }) => (
              <TextInput
                defaultValue={form.description ?? ''}
                errorMessage={errorMessage}
                inputProps={{ placeholder: tNext('forms.description') }}
                isInvalid={isInvalid}
                isReadOnly={isSubmitting}
                label={t('forms.description')}
                name={name}
              />
            )}
          </FormControl>
          <FormControl errors={errors} name="expDate">
            {({ name, isInvalid, isSubmitting, errorMessage }) => (
              <DateField
                dateFormat={dateFormat}
                defaultValue={form.expDate || ''}
                errorMessage={errorMessage}
                isInvalid={isInvalid}
                isReadOnly={isSubmitting}
                label={t('forms.expDate')}
                name={name}
              />
            )}
          </FormControl>
          <div className="flex justify-end gap-x-2.5">
            {
              <FormControl>
                {({ isSubmitting }) => (
                  <Button
                    className="w-min"
                    icon="close"
                    intent="tertiary"
                    isDisabled={isSubmitting}
                    type="button"
                    onClick={router.back}
                  >
                    {t('ctaLabels.cancel')}
                  </Button>
                )}
              </FormControl>
            }
            <FormControl>
              {({ isSubmitting }) => (
                <Button className="w-min" icon="ok" isLoading={isSubmitting} type="submit">
                  {t('ctaLabels.save')}
                </Button>
              )}
            </FormControl>
          </div>
        </>
      )}
    </Form>
  );
}
