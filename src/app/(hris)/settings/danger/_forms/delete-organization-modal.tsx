'use client';

import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl, Modal, ModalHeader } from '@/lib/ui';
import { deleteOrganization } from '@/app/(hris)/settings/danger/_actions';

type Props = {
  isOpen: boolean;
  onClose(): void;
};

export function DeleteOrganizationModal({ isOpen, onClose }: Props) {
  const t = useTranslations('settings.dangerView');

  return (
    <Modal isOpen={isOpen}>
      <FormControl>
        {({ isSubmitting }) => (
          <ModalHeader isDisabled={isSubmitting} title={t('modal.header')} onClose={onClose} />
        )}
      </FormControl>
      <div className="flex flex-col gap-y-4">
        <p className="text-sm">{t('modal.content1')}</p>
        <p className="text-sm">{t('modal.content2')}</p>
        <div className="ml-auto flex gap-x-4">
          <Form action={deleteOrganization} defaultState={{ status: 'idle', form: undefined }}>
            {() => (
              <div className="flex gap-x-4">
                <FormControl>
                  {({ isSubmitting }) => (
                    <Button
                      icon="close"
                      intent="tertiary"
                      isDisabled={isSubmitting}
                      type="button"
                      onClick={onClose}
                    >
                      {t('cancelCta')}
                    </Button>
                  )}
                </FormControl>
                <FormControl>
                  {({ isSubmitting }) => (
                    <Button icon="trash" intent="danger" isLoading={isSubmitting} type="submit">
                      {t('deleteCta')}
                    </Button>
                  )}
                </FormControl>
              </div>
            )}
          </Form>
        </div>
      </div>
    </Modal>
  );
}
