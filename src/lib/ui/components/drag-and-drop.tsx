'use client';
import { DropZone, type DropZoneProps, type FileDropItem, FileTrigger } from 'react-aria-components';
import { useActionState } from 'react';
import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type BaseActionReturnType } from '@/shared';
import { FormControl } from '@/lib/ui/components/form-control';
import { Icon } from '@/lib/ui';
import { useToast } from '@/lib/ui/hooks';
import { EMPLOYEE_DOCUMENTS_TOASTS } from '@/shared/constants/toast-notifications';
import { Button } from './button';
import { DocumentUploadErrorBar } from './document-upload-error-bar';
import { EmptyBox } from './empty-box';

type Props<TData, TValidation, TForm> = {
  action(
    prevState: BaseActionReturnType<TData, TValidation, TForm>,
    formData: FormData,
  ): Promise<BaseActionReturnType<TData, TValidation, TForm>>;
  defaultState: BaseActionReturnType<TData, TValidation, TForm>;
  showEmptyState?: boolean;
  onSuccess?(): void;
  showSubmittingState?: boolean;
} & DropZoneProps;

export function DragAndDrop<TData, TValidation, TForm>({
  action,
  defaultState,
  children,
  showEmptyState = true,
  showSubmittingState = true,
  onSuccess,
  ...other
}: PropsWithChildren<Props<TData, TValidation, TForm>>) {
  const t = useTranslations();
  const tNext = useNextTranslations('documents');
  const [state, serverAction] = useActionState(action, defaultState);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (state.status === 'success') {
      onSuccess?.();
      toast(EMPLOYEE_DOCUMENTS_TOASTS.UPLOAD);
    }
  }, [onSuccess, state.status, toast]);

  const handleUploadFiles = async (files: File[]) => {
    if (!files.length || !inputRef.current || !formRef.current) return;

    const dt = new DataTransfer();
    files.forEach((file) => {
      dt.items.add(file);
    });

    inputRef.current.files = dt.files;
    formRef.current.requestSubmit();
  };

  const errorMessage =
    state.status === 'validation-error' ? (Object.values(state?.errors ?? {})[0] as string[])[0] : null;

  return (
    <>
      <DocumentUploadErrorBar errorMessage={errorMessage && tNext(errorMessage)} formStatus={state} />
      <form noValidate action={serverAction} ref={formRef}>
        <FormControl>
          {({ isSubmitting }) => (
            <>
              <input className="hidden" name="document" readOnly={isSubmitting} ref={inputRef} type="file" />
              <DropZone
                {...other}
                className="min-h-96 w-full rounded border border-dashed border-transparent transition-colors data-[drop-target]:border-blue-800 data-[drop-target]:bg-blue-100"
                isDisabled={isSubmitting}
                onDrop={async (e) => {
                  const dropItems = e.items.filter((file) => file.kind === 'file') as FileDropItem[];
                  const files = await Promise.all(dropItems.map((item) => item.getFile()));
                  handleUploadFiles(files);
                }}
              >
                {isSubmitting && showSubmittingState && (
                  <p className="flex items-center gap-x-2.5 py-4">
                    <Icon className="inline-block animate-spin text-accent" name="spinner" />
                    <span className="text-sm font-semibold">{t('ctaLabels.uploading')}...</span>
                  </p>
                )}
                {children ? (
                  children
                ) : (
                  <div className="flex min-h-96 flex-col items-center justify-center gap-y-2">
                    {showEmptyState && (
                      <div className="flex flex-col items-center gap-y-1 font-semibold">
                        <EmptyBox />
                        <p className="text-sm">{t('documents.noFiles')}</p>
                      </div>
                    )}
                    <FileTrigger
                      allowsMultiple
                      onSelect={(files) => handleUploadFiles(Array.from(files ?? []))}
                    >
                      <Button icon="upload" iconPlacement="right" isLoading={isSubmitting} type="button">
                        {t('documents.addFile')}
                      </Button>
                    </FileTrigger>
                    <p>{t('documents.or')}</p>
                    <p className="font-semibold">{t('documents.dragAndDrop')}</p>
                  </div>
                )}
              </DropZone>
            </>
          )}
        </FormControl>
      </form>
    </>
  );
}
