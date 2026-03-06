'use client';

import { useActionState, useRef } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, FormControl, DocumentUploadErrorBar } from '@/lib/ui';
import { uploadEmployeeDocument } from '../_actions';

type Props = {
  employeeId: string;
};

export function UploadEmployeeDocumentForm({ employeeId }: Props) {
  const [state, uploadEmployeeDocumentAction] = useActionState(uploadEmployeeDocument, {
    status: 'idle',
    form: { employeeId, file: '' },
  });

  const t = useTranslations('employees.documents');

  const inputRef = useRef<HTMLInputElement>(null);
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <form noValidate action={uploadEmployeeDocumentAction} id="uploadEmployeeDocumentForm">
        <input
          multiple
          className="hidden"
          name="document"
          ref={inputRef}
          type="file"
          onChange={() => formSubmitRef.current?.click()}
        />
        <FormControl>
          {({ isSubmitting }) => (
            <Button
              icon="upload"
              iconPlacement="right"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              {t('addFile')}
            </Button>
          )}
        </FormControl>
        <Button className="hidden" ref={formSubmitRef} type="submit"></Button>
      </form>
      <DocumentUploadErrorBar formStatus={state} />
    </>
  );
}
