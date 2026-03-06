'use client';

import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeeBasicInfoSchema } from '@/app/(hris)/employees/[id]/general/_schemas';
import {
  ContentBlock,
  DateField,
  FormControl,
  Section,
  TextInput,
  Form as FormComponent,
  FormFooter,
} from '@/lib/ui';
import { type CUID, parseDate, parseString } from '@/shared';
import { updateEmployeeBasicInfo } from '@/app/(hris)/employees/[id]/general/_actions';
import { useToast } from '@/lib/ui/hooks';
import { EMPLOYEE_GENERAL_TOASTS } from '@/shared/constants/toast-notifications';
import { type EmployeeGeneralInfoAccess } from '@/api/hris/employees/model/dtos';

type Props = {
  employeeId: CUID;
  basicInfo: EmployeeBasicInfoSchema & {
    _access: { edit: EmployeeGeneralInfoAccess };
  };
  isDisabled?: boolean;
  dateFormat: string;
};

function Form({ employeeId, basicInfo, onSuccess, dateFormat }: Props & { onSuccess: () => void }) {
  const { firstName, lastName, personalId, birthdate, _access } = basicInfo;
  const t = useTranslations();
  const pushToast = useToast();

  const handleSuccess = () => {
    pushToast(EMPLOYEE_GENERAL_TOASTS.BASIC_INFO_UPDATE);
    onSuccess();
  };

  const hasAccessToField = (field: string) => {
    return typeof _access.edit === 'object' ? field in _access.edit : _access.edit;
  };

  return (
    <FormComponent
      focusInputOnError
      action={updateEmployeeBasicInfo}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-x-5"
      defaultState={{
        status: 'idle',
        form: {
          firstName,
          lastName,
          personalId: personalId ?? '',
          birthdate: birthdate?.toString() ?? '',
          employeeId,
        },
      }}
      onSuccess={handleSuccess}
    >
      {(form, formErrors) => (
        <>
          {
            <FormControl errors={formErrors} name="firstName">
              {(formState) => (
                <TextInput
                  autoFocus
                  isRequired
                  defaultValue={form.firstName}
                  isDisabled={!hasAccessToField('firstName')}
                  label={t('employees.generalView.firstName')}
                  {...formState}
                />
              )}
            </FormControl>
          }
          <FormControl errors={formErrors} name="lastName">
            {(fromState) => (
              <TextInput
                isRequired
                defaultValue={form.lastName}
                isDisabled={!hasAccessToField('lastName')}
                label={t('employees.generalView.lastName')}
                {...fromState}
              />
            )}
          </FormControl>
          <FormControl errors={formErrors} name="birthdate">
            {(fromState) => (
              <DateField
                dateFormat={dateFormat}
                defaultValue={form.birthdate || ''}
                isDisabled={!hasAccessToField('birthdate')}
                label={t('employees.generalView.birthdate')}
                {...fromState}
              />
            )}
          </FormControl>
          <FormControl errors={formErrors} name="personalId">
            {(formState) => (
              <TextInput
                defaultValue={form.personalId ?? ''}
                isDisabled={!hasAccessToField('personalId')}
                label={t('employees.generalView.personalId')}
                {...formState}
              />
            )}
          </FormControl>
          <FormFooter onCancel={onSuccess} />
        </>
      )}
    </FormComponent>
  );
}

export function BasicInfoForm({ employeeId, isDisabled, basicInfo, dateFormat }: Props): JSX.Element {
  const { firstName, lastName, personalId, birthdate, _access } = basicInfo;

  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations();

  if (isEditing) {
    return (
      <Section heading={t('employees.generalView.basic')} id="generalInfo">
        <Form
          basicInfo={basicInfo}
          dateFormat={dateFormat}
          employeeId={employeeId}
          onSuccess={() => setIsEditing(false)}
        />
      </Section>
    );
  }

  const canEdit =
    typeof _access.edit === 'object'
      ? 'firstName' in _access.edit || 'lastName' in _access.edit || 'birthdate' in _access.edit
      : _access.edit;

  return (
    <Section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10"
      heading={t('employees.generalView.basic')}
      id="generalInfo"
      isEdit={canEdit && !isDisabled}
      onEdit={() => setIsEditing((prev) => !prev)}
    >
      <ContentBlock label={t('employees.generalView.firstName')}>{parseString(firstName)}</ContentBlock>
      <ContentBlock label={t('employees.generalView.lastName')}>{parseString(lastName)}</ContentBlock>
      <ContentBlock label={t('employees.generalView.birthdate')}>
        {parseString(parseDate(birthdate, dateFormat))}
      </ContentBlock>
      <ContentBlock label={t('employees.generalView.personalId')}>{parseString(personalId)}</ContentBlock>
    </Section>
  );
}
