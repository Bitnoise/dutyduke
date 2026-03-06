import { useTranslations } from '@/shared/service/locale/use-translations';
import { type ActionReturnValidationErrorsType, cn, type PropsWithClassName } from '@/shared';
import { DateField, FormControl, TextInput } from '@/lib/ui';
import { type CreateEquipmentForm } from '../_schemas';

type Props = {
  form?: Pick<
    CreateEquipmentForm,
    'invoiceNumber' | 'supplier' | 'purchaseDate' | 'warrantyDuration' | 'leaseDuration' | 'value'
  >;
  autoFocus?: boolean;
  errors?: ActionReturnValidationErrorsType<CreateEquipmentForm>;
  dateFormat?: string;
};

export function PurchaseInfoForm({
  className,
  autoFocus,
  form,
  errors,
  dateFormat,
}: PropsWithClassName<Props>): JSX.Element {
  const t = useTranslations('company.equipment.create');

  return (
    <section className={cn('grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2', className)}>
      <FormControl errors={errors} name="invoiceNumber">
        {(controlState) => (
          <TextInput
            autoFocus={autoFocus}
            defaultValue={form?.invoiceNumber}
            label={t('invoiceNumber')}
            {...controlState}
          />
        )}
      </FormControl>
      <FormControl errors={errors} name="supplier">
        {(controlState) => (
          <TextInput defaultValue={form?.supplier} label={t('supplier')} {...controlState} />
        )}
      </FormControl>
      <FormControl errors={errors} name="purchaseDate">
        {(controlState) => (
          <DateField
            dateFormat={dateFormat}
            defaultValue={form?.purchaseDate}
            label={t('purchaseDate')}
            {...controlState}
          />
        )}
      </FormControl>
      <FormControl errors={errors} name="warrantyDuration">
        {(controlState) => (
          <TextInput
            defaultValue={form?.warrantyDuration}
            label={t('warrantyDuration')}
            type="number"
            {...controlState}
          />
        )}
      </FormControl>
      <FormControl errors={errors} name="leaseDuration">
        {(controlState) => (
          <TextInput
            defaultValue={form?.leaseDuration}
            label={t('leaseDuration')}
            type="number"
            {...controlState}
          />
        )}
      </FormControl>
      <FormControl errors={errors} name="value">
        {(controlState) => (
          <TextInput defaultValue={form?.value} label={t('value')} type="number" {...controlState} />
        )}
      </FormControl>
    </section>
  );
}
