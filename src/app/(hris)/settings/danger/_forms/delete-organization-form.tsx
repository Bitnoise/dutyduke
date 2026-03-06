'use client';

import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Checkbox, Section } from '@/lib/ui';
import { useModal } from '@/lib/ui/hooks';
import { DeleteOrganizationModal } from './delete-organization-modal';

function Form({ onCancel }: { onCancel: () => void }): JSX.Element {
  const t = useTranslations('settings.dangerView');
  const [isAccepted, setIsAccepted] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  const handleClose = () => {
    closeModal();
    onCancel();
  };

  return (
    <>
      <Section heading={t('deleteOrganization')} headingClassName="text-warning">
        <p className="pb-6 text-sm">{t('deleteOrganizationDescription')}</p>
        <Checkbox className="text-sm" name="deleteOrganizationAccept" onChange={setIsAccepted}>
          {t('deleteOrganizationAccept')}
        </Checkbox>
        <div className="flex gap-x-4 pt-6">
          <Button icon="trash" intent="danger" isDisabled={!isAccepted} onClick={openModal}>
            {t('deleteCta')}
          </Button>
          <Button icon="close" intent="tertiary" onClick={onCancel}>
            {t('cancelCta')}
          </Button>
        </div>
      </Section>
      <DeleteOrganizationModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

export function DeleteOrganizationForm(): JSX.Element {
  const [isEdit, setIsEdit] = useState(false);
  const t = useTranslations('settings.dangerView');

  if (isEdit) {
    return <Form onCancel={() => setIsEdit(false)} />;
  }

  return (
    <Section
      isEdit
      heading={t('deleteOrganization')}
      headingClassName="text-warning"
      onEdit={() => setIsEdit(true)}
    >
      <p className="text-sm">{t('deleteOrganizationDescription')}</p>
    </Section>
  );
}
