'use client';

import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { updateEquipmentPurchaseInfo } from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/general/_actions';
import { type EquipmentPurchaseInfoSchema } from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/general/_schemas';
import { PurchaseInfoForm } from '@/app/(hris)/company/equipment/create/_forms/purchase-info-form';
import { ContentBlock, Form, FormFooter, Section } from '@/lib/ui';
import { useToast } from '@/lib/ui/hooks';
import { parseDate, parseString, type WithId } from '@/shared';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';

type Props = {
  isEditable: boolean;
  equipment: WithId<EquipmentPurchaseInfoSchema>;
  dateFormat: string;
};

export function EquipmentPurchaseInfoForm({
  equipment,
  onSuccess,
  dateFormat,
}: Props & { onSuccess(): void }) {
  const t = useTranslations('company.equipment.general');
  const toast = useToast();

  const handleSuccess = () => {
    toast(EQUIPMENT_TOASTS.UPDATE);
    onSuccess();
  };

  return (
    <Section heading={t('purchase')}>
      <Form
        action={updateEquipmentPurchaseInfo}
        defaultState={{
          status: 'idle',
          form: {
            invoiceNumber: parseString(equipment.invoiceNumber, ''),
            supplier: parseString(equipment.supplier, ''),
            value: parseString(equipment.value?.toString(), ''),
            purchaseDate: parseDate(equipment.purchaseDate, dateFormat),
            warrantyDuration: parseString(equipment.warrantyDuration?.toString(), ''),
            leaseDuration: parseString(equipment.leaseDuration?.toString(), ''),
            equipmentId: equipment.id,
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <PurchaseInfoForm errors={errors} form={form} />
            <FormFooter className="pt-6" onCancel={onSuccess} />
          </>
        )}
      </Form>
    </Section>
  );
}

export function EquipmentPurchaseInfoSegment(props: Props) {
  const { equipment, isEditable } = props;
  const [isEdit, setIsEdit] = useState(false);
  const t = useTranslations('company.equipment.general');

  if (isEdit) {
    return <EquipmentPurchaseInfoForm {...props} onSuccess={() => setIsEdit(false)} />;
  }

  return (
    <Section
      className="grid gap-y-6 md:grid-cols-2"
      heading={t('purchase')}
      isEdit={isEditable}
      onEdit={() => setIsEdit(true)}
    >
      <ContentBlock label={t('invoiceNumber')}>{parseString(equipment.invoiceNumber)}</ContentBlock>
      <ContentBlock label={t('supplier')}>{parseString(equipment.supplier)}</ContentBlock>
      <ContentBlock label={t('purchaseDate')}>
        {equipment.purchaseDate ? parseDate(equipment.purchaseDate, props.dateFormat) : '-'}
      </ContentBlock>
      <ContentBlock label={t('warrantyDuration')}>
        {parseString(equipment.warrantyDuration?.toString())}
      </ContentBlock>
      <ContentBlock label={t('leaseDuration')}>
        {parseString(equipment.leaseDuration?.toString())}
      </ContentBlock>
      <ContentBlock label={t('value')}>{parseString(equipment.value?.toString())}</ContentBlock>
    </Section>
  );
}
