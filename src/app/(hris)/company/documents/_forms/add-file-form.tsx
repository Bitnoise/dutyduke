'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { HRIS_ROUTES, type CUID } from '@/shared';
import { Button, ComboBox, DateField, Form, FormControl, TextInput } from '@/lib/ui';
import { type FileData } from '@/shared/types/file';
import { FilesList } from '../_components';
import { addDocument } from '../_actions';

type Props = {
  categories: { key: string; label: string }[];
  dateFormat: string;
};

export function AddFileForm({ categories, dateFormat }: Props): JSX.Element {
  const t = useTranslations('company.documents.add');
  const tNext = useNextTranslations('company.documents.add');
  const router = useRouter();

  const [files, setFiles] = useState<FileData[]>([]);

  const dataTransfer = useRef<DataTransfer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dataTransfer.current = new DataTransfer();
  }, []);

  const addFiles = (attachedFiles: FileList | null) => {
    if (!inputRef.current || !attachedFiles || !dataTransfer.current) return;
    const filesArray = Array.from(attachedFiles);
    const filesToUpload: FileData[] = [];

    for (const file of filesArray) {
      dataTransfer.current.items.add(file);

      filesToUpload.push({
        id: `temp--${createId()}`,
        file,
      });
    }

    inputRef.current.files = dataTransfer.current.files;
    setFiles((prev) => [...prev, ...filesToUpload]);
  };

  const deleteFileFromList = (id: CUID) => {
    if (!inputRef.current || !dataTransfer.current) return;

    const fileToRemove = files.find((file) => file.id === id);
    if (!fileToRemove) return;

    const newDataTransfer = new DataTransfer();
    Array.from(dataTransfer.current.files).forEach((file) => {
      if (file !== fileToRemove.file) {
        newDataTransfer.items.add(file);
      }
    });

    dataTransfer.current = newDataTransfer;
    inputRef.current.files = newDataTransfer.files;

    setFiles(files.filter((file) => file.id !== id));
  };

  const handleSuccess = () => router.push(HRIS_ROUTES.documents.base);

  return (
    <div className="pt-4">
      <Form
        focusInputOnError
        action={addDocument}
        className="flex flex-1 flex-col"
        defaultState={{
          status: 'idle',
          form: {
            category: '',
            description: '',
            documents: [],
            expirationDate: '',
          },
        }}
        onSuccess={handleSuccess}
      >
        {(_, errors) => (
          <>
            <FormControl errors={errors} name="category">
              {(formState) => (
                <ComboBox
                  {...formState}
                  allowsCustomValue
                  className="w-full pb-4 md:w-[calc(50%_-_0.5rem)]"
                  inputProps={{
                    placeholder: tNext('category'),
                  }}
                  items={categories}
                  label={t('category')}
                />
              )}
            </FormControl>
            <div className="flex flex-col gap-4 md:flex-row">
              <FormControl name="description">
                {(formState) => (
                  <TextInput
                    {...formState}
                    description={t('infoDescription')}
                    isDisabled={files.length > 1}
                    label={t('description')}
                    name="description"
                  />
                )}
              </FormControl>
              <FormControl name="expirationDate">
                {(formState) => (
                  <DateField
                    {...formState}
                    dateFormat={dateFormat}
                    label={t('expirationDate')}
                    name="expirationDate"
                  />
                )}
              </FormControl>
            </div>
            <input
              multiple
              className="hidden"
              name="documents"
              ref={inputRef}
              type="file"
              onChange={(e) => addFiles(e.target.files)}
            />
            <FormControl>
              {({ isSubmitting }) => (
                <div className="pt-4">
                  <Button
                    icon="upload"
                    iconPlacement="right"
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                    type="button"
                    onClick={() => inputRef.current?.click()}
                  >
                    {t('addFiles')}
                  </Button>
                </div>
              )}
            </FormControl>
            <div className="pt-4">
              <FilesList data={files} onDeleteFile={deleteFileFromList} />
            </div>
            <FormControl>
              {({ isSubmitting }) => (
                <div className="flex justify-between pt-4">
                  <Button
                    intent="secondary"
                    isLoading={isSubmitting}
                    type="button"
                    onClick={() => router.push(HRIS_ROUTES.documents.base)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    icon="ok"
                    intent="primary"
                    isDisabled={!files.length}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    {t('submit')}
                  </Button>
                </div>
              )}
            </FormControl>
          </>
        )}
      </Form>
    </div>
  );
}
