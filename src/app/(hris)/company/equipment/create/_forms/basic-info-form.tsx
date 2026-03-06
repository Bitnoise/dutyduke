'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { ComboBox, FormControl, PhotoInput, TextArea, TextInput } from '@/lib/ui';
import { type ActionReturnValidationErrorsType, API_ROUTES, cn, type PropsWithClassName } from '@/shared';
import { type Item } from '@/lib/ui/components/combo-box/types';
import { type CreateEquipmentForm } from '../_schemas';

type Props = {
  autoFocus?: boolean;
  form: Pick<
    CreateEquipmentForm,
    | 'category'
    | 'signature'
    | 'name'
    | 'brand'
    | 'model'
    | 'status'
    | 'location'
    | 'description'
    | 'serial'
    | 'avatar'
  >;
  categories: Item[];
  locations: Item[];
  errors?: ActionReturnValidationErrorsType<CreateEquipmentForm>;
};

export function BasicInfoForm({
  form,
  className,
  autoFocus,
  locations,
  categories,
  errors,
}: PropsWithClassName<Props>) {
  const t = useTranslations('company.equipment.create');
  const tNext = useNextTranslations('company.equipment.create');
  const statuses = useMemo(
    () => [
      { key: 'WORKING', label: tNext('statusLabels.working') },
      { key: 'IN_SERVICE', label: tNext('statusLabels.in_service') },
      { key: 'BROKEN', label: tNext('statusLabels.broken') },
    ],
    [tNext],
  );

  return (
    <section className={cn('grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2', className)}>
      <FormControl errors={errors} name="signature">
        {(controlState) => (
          <TextInput
            isRequired
            autoFocus={autoFocus}
            defaultValue={form.signature}
            label={t('signature')}
            {...controlState}
          />
        )}
      </FormControl>
      <FormControl errors={errors} name="category">
        {(controlState) => (
          <ComboBox
            allowsCustomValue
            isRequired
            defaultInputValue={form.category}
            items={categories}
            label={t('category')}
            {...controlState}
          />
        )}
      </FormControl>
      <FormControl errors={errors} name="name">
        {(controlState) => (
          <TextInput isRequired defaultValue={form.name} label={t('name')} {...controlState} />
        )}
      </FormControl>
      <div />
      <FormControl errors={errors} name="brand">
        {(controlState) => <TextInput defaultValue={form.brand} label={t('brand')} {...controlState} />}
      </FormControl>
      <FormControl errors={errors} name="model">
        {(controlState) => <TextInput defaultValue={form.model} label={t('model')} {...controlState} />}
      </FormControl>
      <FormControl errors={errors} name="status">
        {(controlState) => (
          <ComboBox
            defaultSelectedKey={statuses.find((status) => status.key === form.status)?.key ?? 'WORKING'}
            items={statuses}
            label={t('status')}
            {...controlState}
          />
        )}
      </FormControl>
      <FormControl errors={errors} name="location">
        {(controlState) => (
          <ComboBox
            allowsCustomValue
            defaultSelectedKey={locations.find((location) => location.label === form.location)?.key}
            items={locations}
            label={t('location')}
            {...controlState}
          />
        )}
      </FormControl>
      <div className="col-span-full">
        <FormControl errors={errors} name="description">
          {(controlState) => (
            <TextArea
              defaultValue={form.description}
              inputProps={{ rows: 10 }}
              label={t('description')}
              {...controlState}
            />
          )}
        </FormControl>
      </div>
      <FormControl errors={errors} name="serial">
        {(controlState) => (
          <TextInput defaultValue={form.serial} label={t('serialNumber')} {...controlState} />
        )}
      </FormControl>
      <FormControl errors={errors} name="photo">
        {({ isSubmitting, errorMessage }) => (
          <PhotoInput
            defaultPhotoSrc={
              typeof form.avatar === 'string' && form.avatar !== ''
                ? API_ROUTES.equipment.photos.view(form.avatar)
                : undefined
            }
            disabled={isSubmitting}
            errorMessage={errorMessage}
            id={typeof form.avatar === 'string' ? form.avatar : 'photo'}
            label={t('photo')}
            name="photo"
          />
        )}
      </FormControl>
    </section>
  );
}
