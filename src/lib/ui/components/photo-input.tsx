'use client';

import { type ReactNode, useRef, useState } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { PhotoUploadButton } from '@/lib/ui/components/photos-list';
import { Photo } from '@/lib/ui/components/photo';
import { cn } from '@/shared';
import { Label } from '@/lib/ui';

type Props = {
  defaultPhotoSrc?: string;
  label?: string | ReactNode;
  errorMessage?: string;
  onDelete?(): void;
} & React.ComponentProps<'input'>;

export function PhotoInput({ defaultPhotoSrc, label, id, errorMessage, name, onDelete, ...other }: Props) {
  const tNext = useNextTranslations('forms');
  const [uploadedPhoto, setUploadedPhoto] = useState<File | string | undefined>(defaultPhotoSrc);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedPhoto(event.currentTarget.files?.[0]);
  };

  const handleDelete = () => {
    setUploadedPhoto(undefined);
    if (inputRef.current) {
      // Clear file input using DataTransfer
      const dt = new DataTransfer();
      inputRef.current.files = dt.files;
    }
    onDelete?.();
  };

  return (
    <div className="flex flex-col gap-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      {uploadedPhoto && (
        <>
          {typeof uploadedPhoto === 'string' && (
            <input defaultValue={id} id={id} name={name} type="hidden" {...other} />
          )}
          <Photo
            alt={tNext('photo') ?? ''}
            src={typeof uploadedPhoto === 'string' ? uploadedPhoto : URL.createObjectURL(uploadedPhoto)}
            onDelete={handleDelete}
          />
        </>
      )}
      <PhotoUploadButton
        className={cn({ hidden: !!uploadedPhoto })}
        name={name}
        ref={inputRef}
        onChange={handleUploadFile}
      />
      {errorMessage && (
        <p aria-live="assertive" className="pt-1 text-xxs leading-[0.75rem] text-warning">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
