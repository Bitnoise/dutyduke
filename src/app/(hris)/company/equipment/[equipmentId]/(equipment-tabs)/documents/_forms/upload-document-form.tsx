'use client';

import { useActionState, useRef } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, FormControl, DocumentUploadErrorBar } from '@/lib/ui';
import { uploadEquipmentDocument } from '../_actions/upload-equipment-document.action';

type Props = {
  equipmentId: string;
};

export function UploadEquipmentDocumentForm({ equipmentId }: Props) {
  const [state, uploadEmployeeDocumentAction] = useActionState(uploadEquipmentDocument, {
    status: 'idle',
    form: { equipmentId, file: '' },
  });

  const t = useTranslations('company.equipment.documents');

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
