'use client';

import { type ComponentProps, useRef, useState } from 'react';
import { FileTrigger } from 'react-aria-components';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button } from './button';
import { FieldError } from './field-error';

type Props = ComponentProps<'input'> & {
  errorMessage?: string;
};

export function AddFile({ disabled, errorMessage, ...rest }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const t = useTranslations('forms');

  const addFile = (files: File[]) => {
    if (!inputRef.current) return;

    const dt = new DataTransfer();

    dt.items.add(files[0]);

    setFile(files[0]);

    inputRef.current.files = dt.files;
  };

  const removeFile = () => {
    if (!inputRef.current) return;

    const dt = new DataTransfer();

    dt.items.clear();

    setFile(null);

    inputRef.current.files = dt.files;
  };

  return (
    <>
      {file ? (
        <div className="flex items-center gap-x-2">
          <span>{file.name}</span>
          <Button className="text-red-400" icon="trash" intent="ghost" onClick={removeFile} />
        </div>
      ) : (
        <FileTrigger
          onSelect={(e) => {
            addFile(Array.from(e ?? []));
          }}
        >
          <Button icon="upload" intent="tertiary" isDisabled={disabled}>
            {t('addFile')}
          </Button>
        </FileTrigger>
      )}
      <input className="hidden" disabled={disabled} ref={inputRef} type="file" {...rest} />
      <FieldError className="font-light text-warning">{errorMessage}</FieldError>
    </>
  );
}
