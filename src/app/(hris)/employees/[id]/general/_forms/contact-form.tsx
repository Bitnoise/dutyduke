'use client';

import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeeContactInfoSchema } from '@/app/(hris)/employees/[id]/general/_schemas';
import {
  ContentBlock,
  FormControl,
  Section,
  TextArea,
  TextInput,
  Form as FormComponent,
  FormFooter,
} from '@/lib/ui';
import { parseString, type CUID } from '@/shared';
import { updateEmployeeContactInfo } from '@/app/(hris)/employees/[id]/general/_actions';
import { useToast } from '@/lib/ui/hooks';
import { EMPLOYEE_GENERAL_TOASTS } from '@/shared/constants/toast-notifications';
import { type EmployeeGeneralInfoAccess } from '@/api/hris/employees/model/dtos';

type Props = {
  employeeId: CUID;
  contactInfo: EmployeeContactInfoSchema & { _access: { edit: EmployeeGeneralInfoAccess } };
  isDisabled?: boolean;
};

function Form({ employeeId, contactInfo, onSuccess }: Props & { onSuccess: () => void }): JSX.Element {
  const t = useTranslations();
  const pushToast = useToast();

  const handleSuccess = () => {
    onSuccess();
    pushToast(EMPLOYEE_GENERAL_TOASTS.CONTACT_INFO_UPDATE);
  };

  const hasAccessToField = (field: string) => {
    return typeof contactInfo._access.edit === 'object'
      ? field in contactInfo._access.edit
      : contactInfo._access.edit;
  };

  return (
    <Section heading={t('employees.generalView.contact')} id="contact">
      <FormComponent
        focusInputOnError
        action={updateEmployeeContactInfo}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10"
        defaultState={{
          status: 'idle',
          form: {
            ...contactInfo,
            phone: contactInfo.phone ?? '',
            iceName: contactInfo.iceName ?? '',
            icePhone: contactInfo.icePhone ?? '',
            additionalEmails: contactInfo.additionalEmails.join(', '),
            employeeId,
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <FormControl errors={errors} name="phone">
              {(formState) => (
                <TextInput
                  autoFocus
                  defaultValue={form.phone}
                  isDisabled={!hasAccessToField('phone')}
                  label={t('employees.generalView.phone')}
                  {...formState}
                />
              )}
            </FormControl>
            <FormControl name="workEmail">
              {(formState) => (
                <TextInput
                  isDisabled
                  defaultValue={form.workEmail}
                  label={t('employees.generalView.workEmail')}
                  type="email"
                  {...formState}
                />
              )}
            </FormControl>
            <div className="flex gap-x-4">
              <FormControl errors={errors} name="iceName">
                {(formState) => (
                  <TextInput
                    defaultValue={form.iceName}
                    isDisabled={!hasAccessToField('iceName')}
                    label={t('employees.generalView.iceName')}
                    {...formState}
                  />
                )}
              </FormControl>
              <FormControl errors={errors} name="icePhone">
                {(formState) => (
                  <TextInput
                    defaultValue={form.icePhone}
                    isDisabled={!hasAccessToField('icePhone')}
                    label={t('employees.generalView.icePhone')}
                    {...formState}
                  />
                )}
              </FormControl>
            </div>
            <FormControl errors={errors} name="additionalEmails">
              {(formState) => (
                <TextArea
                  defaultValue={form.additionalEmails}
                  inputProps={{
                    placeholder: 'a@doe.com, b@doe.com, c@doe.com...',
                  }}
                  isDisabled={!hasAccessToField('additionalEmails')}
                  label={t('employees.generalView.additionalEmails')}
                  {...formState}
                />
              )}
            </FormControl>
            <FormFooter onCancel={onSuccess} />
          </>
        )}
      </FormComponent>
    </Section>
  );
}

export function ContactForm({ employeeId, contactInfo, isDisabled }: Props): JSX.Element {
  const { workEmail, additionalEmails, phone, iceName, icePhone, _access } = contactInfo;

  const [isEdit, setIsEdit] = useState(false);
  const t = useTranslations();

  if (isEdit) {
    return <Form contactInfo={contactInfo} employeeId={employeeId} onSuccess={() => setIsEdit(false)} />;
  }

  const canEdit =
    typeof _access?.edit === 'object'
      ? 'phone' in _access.edit ||
        'workEmail' in _access.edit ||
        'additionalEmails' in _access.edit ||
        'iceName' in _access.edit ||
        'icePhone' in _access.edit
      : _access.edit;

  return (
    <Section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10"
      heading={t('employees.generalView.contact')}
      id="contact"
      isEdit={canEdit && !isDisabled}
      onEdit={() => setIsEdit(true)}
    >
      <ContentBlock label={t('employees.generalView.phone')}>{parseString(phone)}</ContentBlock>
      <ContentBlock label={t('employees.generalView.workEmail')}>{workEmail}</ContentBlock>
      <ContentBlock className="flex gap-x-8" label={t('employees.generalView.ice')}>
        <p>{parseString(iceName)}</p>
        <p>{icePhone}</p>
      </ContentBlock>
      <ContentBlock label={t('employees.generalView.additionalEmails')}>
        {additionalEmails.length > 0 ? (
          <ul>
            {additionalEmails.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </ContentBlock>
    </Section>
  );
}
