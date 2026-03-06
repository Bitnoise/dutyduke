'use client';

import { useActionState } from 'react';
import { type PropsWithChildren, useCallback, useRef, useState } from 'react';
import { DropZone, type FileDropItem } from 'react-aria-components';
import { cn, type UploadEmployeeDocumentState } from '@/shared';
import { Button, DocumentUploadErrorBar } from '@/lib/ui';
import { uploadEmployeeDocument } from '../_actions';

type Props = {
  employeeId: string;
  isDisabled?: boolean;
};

export function UploadEmployeeDocumentDropzoneForm({
  employeeId,
  isDisabled = false,
  children,
}: PropsWithChildren<Props>) {
  const [state, uploadEmployeeDocumentAction] = useActionState(uploadEmployeeDocument, {
    status: 'idle',
    form: { employeeId },
  });
  const [dropzoneState, setDropzoneState] = useState<UploadEmployeeDocumentState>({
    status: 'idle',
    form: { employeeId },
  });

  const handleDropzone = useCallback(
    async (fileToUpload: FileDropItem[]) => {
      if (isDisabled) return;

      const formData = new FormData();
      formData.append('employeeId', employeeId);
      if (!fileToUpload) return;
      const files = await Promise.all(
        fileToUpload.map(async (item) => {
          return await item.getFile();
        }),
      );
      files.forEach((file) => formData.append('document', file));
      const results = await uploadEmployeeDocument(state, formData);
      setDropzoneState(results);
    },
    [employeeId, isDisabled, state],
  );

  const [dropActive, setDropActive] = useState(false);
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DocumentUploadErrorBar formStatus={dropzoneState} />
      <section>
        <form noValidate action={uploadEmployeeDocumentAction} id="uploadEmployeeDocumentForm">
          <DropZone
            className={cn('rounded transition-colors', {
              'ring-2 ring-accent': dropActive,
            })}
            isDisabled={isDisabled}
            onDrop={(e) => {
              const file: FileDropItem[] = e.items as FileDropItem[];
              handleDropzone(file);
            }}
            onDropEnter={() => setDropActive(true)}
            onDropExit={() => setDropActive(false)}
          >
            {children}
          </DropZone>
          <Button aria-hidden="true" className="hidden" ref={formSubmitRef}></Button>
        </form>
      </section>
    </>
  );
}
