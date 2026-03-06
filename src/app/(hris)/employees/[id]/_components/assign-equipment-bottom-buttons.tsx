'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl, Modal, ModalHeader } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';
import { assignEmployee } from '../../_actions';

type Props = {
  equipmentIds: string;
  employeeId?: string;
  category?: string;
  filter?: string;
  status?: string;
  isAssigned?: boolean;
};

export function AssignEquipmentBottomButtons({
  equipmentIds,
  employeeId,
  category,
  status,
  filter,
  isAssigned,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const toast = useToast();
  const router = useRouter();

  const chosenEquipments = equipmentIds === 'all' ? 'all' : equipmentIds?.split(',');

  const onCancel = () => router.back();

  const handleSuccess = () => {
    setIsOpen(false);
    router.push(employeeId ? HRIS_ROUTES.employees.equipment.base(employeeId) : HRIS_ROUTES.employees.base);
    toast(EQUIPMENT_TOASTS.UPDATE);
  };

  const onClose = () => setIsOpen(false);

  return (
    <Form
      action={assignEmployee}
      defaultState={{
        status: 'idle',
        form: {
          equipmentIds: chosenEquipments,
          assigneeId: employeeId ?? '',
          filterCategory: category ?? '',
          filter: filter ?? '',
          filterStatus: status ?? '',
        },
      }}
      id="assignEquipmentForm"
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <div className="flex justify-between">
          <FormControl errors={errors}>
            {({ isSubmitting }) => (
              <Button
                icon="close"
                intent="tertiary"
                isDisabled={isSubmitting}
                type="button"
                onClick={onCancel}
              >
                {t('ctaLabels.cancel')}
              </Button>
            )}
          </FormControl>
          <FormControl errors={errors}>
            {({ isSubmitting }) => (
              <Button
                icon="link-individual"
                isDisabled={isSubmitting || !equipmentIds}
                type={isAssigned ? 'button' : 'submit'}
                onClick={() => setIsOpen(!!isAssigned)}
              >
                {t('ctaLabels.assign')}
              </Button>
            )}
          </FormControl>
          <FormControl errors={errors}>
            {({ isSubmitting }) => (
              <Modal isOpen={isOpen}>
                <ModalHeader title={t('modal.header.assignEquipment')} onClose={onClose} />
                <p className="py-4">{t('modal.content.assignEquipment')}</p>
                <div className="flex justify-end gap-x-4">
                  <Button icon="close" intent="tertiary" type="button" onClick={onClose}>
                    {t('ctaLabels.no')}
                  </Button>
                  <Button
                    form="assignEquipmentForm"
                    icon="ok"
                    intent="primary"
                    isDisabled={isSubmitting}
                    type="submit"
                  >
                    {t('ctaLabels.confirmChange')}
                  </Button>
                </div>
              </Modal>
            )}
          </FormControl>
        </div>
      )}
    </Form>
  );
}
