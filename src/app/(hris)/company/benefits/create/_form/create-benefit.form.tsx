'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Button, Form, FormControl, TextInput, TextArea } from '@/lib/ui';
import { HRIS_ROUTES } from '@/shared';
import { useToast } from '@/lib/ui/hooks';
import { createBenefit } from '../_actions/create-benefit.action';

export function CreateBenefitForm(): JSX.Element {
  const t = useTranslations('company.benefits.create');
  const router = useRouter();
  const toast = useToast();

  const goBack = () => {
    router.back();
  };

  const handleSuccess = () => {
    toast({ label: 'company.benefits.create.success', intent: 'success' });
    router.push(HRIS_ROUTES.benefits.base);
  };

  return (
    <Form
      action={createBenefit}
      defaultState={{
        status: 'idle',
        form: {
          name: '',
          note: '',
        },
      }}
      onSuccess={handleSuccess}
    >
      {(_form, errors) => (
        <div className="flex flex-col gap-y-6">
          <FormControl errors={errors} name="name">
            {(control) => <TextInput isRequired {...control} label={t('name')} />}
          </FormControl>
          <FormControl errors={errors} name="note">
            {(control) => <TextArea {...control} label={t('description')} />}
          </FormControl>
          <div className="flex justify-between pt-8">
            <FormControl>
              {({ isSubmitting }) => (
                <Button
                  icon="close"
                  intent="tertiary"
                  isLoading={isSubmitting}
                  type="button"
                  onClick={goBack}
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
