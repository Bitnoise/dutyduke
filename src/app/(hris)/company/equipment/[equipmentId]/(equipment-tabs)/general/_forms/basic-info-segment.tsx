'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EquipmentBasicInfoSchema } from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/general/_schemas';
import { ContentBlock, Form, FormFooter, Photo, Section } from '@/lib/ui';
import { API_ROUTES, parseString, type WithId } from '@/shared';
import { updateEquipmentBasicInfo } from '@/app/(hris)/company/equipment/[equipmentId]/(equipment-tabs)/general/_actions';
import { BasicInfoForm } from '@/app/(hris)/company/equipment/create/_forms/basic-info-form';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { useToast } from '@/lib/ui/hooks';
import { EQUIPMENT_TOASTS } from '@/shared/constants/toast-notifications';

type Props = {
  equipment: WithId<EquipmentBasicInfoSchema>;
  categories: Item[];
  locations: Item[];
  isEditable?: boolean;
};

function BasicInfoFormSegment({
  equipment,
  categories,
  locations,
  onSuccess,
}: Props & { onSuccess(): void }) {
  const t = useTranslations('company.equipment');
  const toast = useToast();

  const handleSuccess = () => {
    toast(EQUIPMENT_TOASTS.UPDATE);
    onSuccess();
  };

  return (
    <Section heading={t('general.basicInfo')}>
      <Form
        action={updateEquipmentBasicInfo}
        defaultState={{
          status: 'idle',
          form: {
            category: equipment.category ?? '',
            signature: equipment.signature,
            name: equipment.name,
            brand: parseString(equipment.brand, ''),
            model: parseString(equipment.model, ''),
            status: equipment.status,
            location: equipment.location ?? '',
            description: parseString(equipment.description, ''),
            serial: parseString(equipment.serial, ''),
            equipmentId: equipment.id,
            avatar: equipment.avatar ?? '',
            avatarId: equipment.avatarId,
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <BasicInfoForm categories={categories} errors={errors} form={form} locations={locations} />
            <FormFooter className="pt-6" onCancel={onSuccess} />
          </>
        )}
      </Form>
    </Section>
  );
}

export function BasicInfoSegment(props: Props) {
  const { equipment, isEditable } = props;
  const t = useTranslations('company.equipment');
  const tNext = useNextTranslations('company.equipment');
  const [isEdit, setIsEdit] = useState(false);

  if (isEdit) {
    return <BasicInfoFormSegment onSuccess={() => setIsEdit(false)} {...props} />;
  }

  return (
    <Section
      className="grid gap-y-6 md:grid-cols-2"
      heading={t('general.basicInfo')}
      isEdit={isEditable}
      onEdit={() => setIsEdit(true)}
    >
      <ContentBlock label={t('general.category')}>{equipment.category}</ContentBlock>
      <ContentBlock label={t('general.signature')}>{equipment.signature}</ContentBlock>
      <ContentBlock label={t('general.name')}>{equipment.name}</ContentBlock>
      <div />
      <ContentBlock label={t('general.brand')}>{parseString(equipment.brand)}</ContentBlock>
      <ContentBlock label={t('general.model')}>{parseString(equipment.model)}</ContentBlock>
      <ContentBlock label={t('general.status')}>
        {t(`statusLabels.${equipment.status.toLowerCase()}`)}
      </ContentBlock>
      <ContentBlock label={t('general.location')}>{parseString(equipment.location)}</ContentBlock>
      <ContentBlock label={t('general.description')}>{parseString(equipment.description)}</ContentBlock>
      <div />
      <ContentBlock label={t('general.serialNumber')}>{parseString(equipment.serial)}</ContentBlock>
      <ContentBlock label={t('general.photo')}>
        {equipment.avatarId ? (
          <Photo
            alt={tNext('general.equipmentPhotoAlt') ?? ''}
            downloadLink={API_ROUTES.equipment.photos.download(equipment.avatarId)}
            id={equipment.avatarId}
            src={API_ROUTES.equipment.photos.view(equipment.avatarId)}
          />
        ) : (
          '-'
        )}
      </ContentBlock>
    </Section>
  );
}
