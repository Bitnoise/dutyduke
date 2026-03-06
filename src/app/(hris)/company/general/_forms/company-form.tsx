'use client';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import {
  Button,
  ContentBlock,
  FormControl,
  Section,
  TextInput,
  Form as FormComponent,
  PhotoInput,
} from '@/lib/ui';
import { updateCompany } from '@/app/(hris)/company/general/_actions';
import { type CompanySchema } from '@/app/(hris)/company/general/_schemas';
import { API_ROUTES, parseString } from '@/shared';
import { PhotoListItem } from '@/lib/ui/components/photos-list/photo-list-item';
import { useToast } from '@/lib/ui/hooks';
import { COMPANY_GENERAL_TOASTS } from '@/shared/constants/toast-notifications';

type Props = {
  company: CompanySchema & { _access: { edit: boolean } };
};

function Form({ company, onSuccess }: Props & { onSuccess(): void }): JSX.Element {
  const { name, logo } = company;
  const t = useTranslations('company.generalView');
  const pushToast = useToast();
  const [logoId, setLogoId] = useState<string | null>(typeof logo === 'string' ? logo : null);

  const handleSuccess = () => {
    onSuccess();
    pushToast(COMPANY_GENERAL_TOASTS.BASIC_INFO_UPDATE);
  };

  return (
    <Section heading={t('company')}>
      <FormComponent
        action={updateCompany}
        className="flex flex-col gap-y-6"
        defaultState={{
          status: 'idle',
          form: {
            name,
            logo: logoId,
            logoId: logoId,
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <FormControl errors={errors} name="name">
              {(formState) => (
                <TextInput
                  autoFocus
                  isRequired
                  defaultValue={form.name}
                  description={t('changingCompanyNameInfo')}
                  label={t('companyName')}
                  {...formState}
                />
              )}
            </FormControl>
            <FormControl errors={errors} name="logo" translationValues={{ size: '10' }}>
              {({ name, isSubmitting, errorMessage }) => (
                <div>
                  <PhotoInput
                    defaultPhotoSrc={
                      typeof form.logo === 'string' ? API_ROUTES.company.photos.view(form.logo) : undefined
                    }
                    disabled={isSubmitting}
                    errorMessage={errorMessage}
                    label={t('logo')}
                    name={name}
                    onDelete={() => setLogoId(null)}
                  />
                  <input key={logoId} defaultValue={logoId ?? ''} name="logoId" type="hidden" />
                </div>
              )}
            </FormControl>
            <div className="flex justify-end gap-x-4">
              <FormControl>
                {({ isSubmitting }) => (
                  <Button className="w-fit" icon="ok" isDisabled={isSubmitting} type="submit">
                    {t('save')}
                  </Button>
                )}
              </FormControl>
              <FormControl>
                {({ isSubmitting }) => (
                  <Button
                    className="w-fit"
                    icon="close"
                    intent="tertiary"
                    isLoading={isSubmitting}
                    type="button"
                    onClick={onSuccess}
                  >
                    {t('cancel')}
                  </Button>
                )}
              </FormControl>
            </div>
          </>
        )}
      </FormComponent>
    </Section>
  );
}

export function CompanyForm({ company }: Props): JSX.Element {
  const { name, logo } = company;

  const [isEdit, setIsEdit] = useState(false);
  const t = useTranslations('company.generalView');

  if (isEdit) {
    return <Form company={company} onSuccess={() => setIsEdit(false)} />;
  }

  return (
    <Section
      className="flex flex-col gap-y-6"
      heading={t('company')}
      isEdit={company._access.edit}
      onEdit={() => setIsEdit(true)}
    >
      <ContentBlock label={t('companyName')}>{parseString(name)}</ContentBlock>
      <ContentBlock label={t('logo')}>
        {logo ? <PhotoListItem actions={['download']} dir="company" id={logo as string} src={logo} /> : '-'}
      </ContentBlock>
    </Section>
  );
}
