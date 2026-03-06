'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl, TextInput, TextArea } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { BENEFIT_TOASTS } from '@/shared/constants/toast-notifications';
import { type CUID } from '@/shared';
import { updateBenefitAction, type UpdateBenefitState } from '../_actions/update-benefit.action';
import { type EditBenefitSchema } from '../_schemas/edit-benefit.schema';

type Props = {
  benefitId: CUID;
  form: EditBenefitSchema;
};

export function EditBenefitForm({ benefitId, form }: Props): JSX.Element {
  const t = useTranslations('company.benefits.create');
  const router = useRouter();
  const toast = useToast();

  const actionWithId = async (prevState: UpdateBenefitState, formData: FormData) => {
    return updateBenefitAction(prevState, formData, benefitId);
  };

  const handleSuccess = () => {
    toast(BENEFIT_TOASTS.UPDATE);
    router.push(HRIS_ROUTES.benefits.base);
  };

  return (
    <Form
      action={actionWithId}
      defaultState={{
        status: 'idle',
        form,
      }}
      onSuccess={handleSuccess}
    >
      {(formState, errors) => (
        <div className="flex flex-col gap-y-6">
          <FormControl errors={errors} name="name">
            {(control) => (
              <TextInput isRequired defaultValue={formState.name} label={t('name')} {...control} />
            )}
          </FormControl>
          <FormControl errors={errors} name="note">
            {(control) => (
              <TextArea defaultValue={formState.note || ''} label={t('description')} {...control} />
            )}
          </FormControl>
          <div className="flex justify-between pt-8">
            <FormControl>
              {({ isSubmitting }) => (
                <Button
                  icon="close"
                  intent="tertiary"
                  isLoading={isSubmitting}
                  type="button"
                  onClick={() => router.back()}
                >
                  {t('cancel')}
                </Button>
              )}
            </FormControl>
            <FormControl>
              {({ isSubmitting }) => (
                <Button icon="ok" isLoading={isSubmitting} type="submit">
                  {t('save')}
                </Button>
              )}
            </FormControl>
          </div>
        </div>
      )}
    </Form>
  );
}
