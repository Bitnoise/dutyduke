'use client';

import { useRouter } from 'next/navigation';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, ComboBox, DateField, Form, FormControl, TextInput } from '@/lib/ui';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { type Nullable } from '@/shared';
import { type DocumentDto } from '@/api/hris/documents/model/dtos';
import { editDocuments } from '../_actions';

type Props = {
  categories: Item[];
  documentIds: 'all' | string[];
  assignmentFilter?: string;
  filterCategory?: string;
  filterStatus?: string;
  singleDocument: Nullable<DocumentDto>;
  dateFormat: string;
};

export function EditDocumentsForm({
  categories,
  documentIds,
  assignmentFilter,
  filterStatus,
  filterCategory,
  singleDocument,
  dateFormat,
}: Props): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  const router = useRouter();

  return (
    <Form
      focusInputOnError
      action={editDocuments}
      className="flex flex-1 flex-col"
      defaultState={{
        status: 'idle',
        form: {
          category: singleDocument?.categoryId ?? '',
          description: singleDocument?.description ?? '',
          documents: documentIds,
          expirationDate: singleDocument?.expDate?.toISOString() ?? '',
          filter: assignmentFilter,
          filterCategory,
          filterStatus,
        },
      }}
      onSuccess={() => router.back()}
    >
      {(form, errors) => (
        <>
          <FormControl errors={errors} name="category">
            {(formState) => (
              <ComboBox
                {...formState}
                allowsCustomValue
                className="w-full pb-4 md:w-[calc(50%_-_0.5rem)]"
                defaultSelectedKey={form.category}
                inputProps={{
                  placeholder: tNext('company.documents.editModal.category'),
                }}
                items={categories}
                label={t('company.documents.editModal.category')}
              />
            )}
          </FormControl>
          <div className="flex flex-col gap-4 md:flex-row">
            <FormControl name="description">
              {(formState) => (
                <TextInput
                  {...formState}
                  defaultValue={form.description}
                  description={t('company.documents.editModal.editInfoDescription')}
                  isDisabled={documentIds.length > 1}
                  label={t('company.documents.editModal.description')}
                  name="description"
                />
              )}
            </FormControl>
            <FormControl name="expirationDate">
              {(formState) => (
                <DateField
                  {...formState}
                  dateFormat={dateFormat}
                  defaultValue={form.expirationDate}
                  label={t('company.documents.editModal.expirationDate')}
                  name="expirationDate"
                />
              )}
            </FormControl>
          </div>
          <FormControl>
            {({ isSubmitting }) => (
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  icon="close"
                  intent="secondary"
                  isLoading={isSubmitting}
                  type="button"
                  onClick={() => router.back()}
                >
                  {t('ctaLabels.cancel')}
                </Button>
                <Button
                  icon="ok"
                  intent="primary"
                  isDisabled={!documentIds.length}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {t('ctaLabels.submit')}
                </Button>
              </div>
            )}
          </FormControl>
        </>
      )}
    </Form>
  );
}
