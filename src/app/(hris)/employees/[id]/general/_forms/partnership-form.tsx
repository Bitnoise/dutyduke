'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeePartnershipSchema } from '@/app/(hris)/employees/[id]/general/_schemas';
import {
  ComboBox,
  ContentBlock,
  FormControl,
  Section,
  TextInput,
  Form as FormComponent,
  FormFooter,
} from '@/lib/ui';
import { EMPLOYMENT_TYPES, parseEmploymentTypeToLabel, parseString, type CUID } from '@/shared';
import { updateEmployeePartnershipInfo } from '@/app/(hris)/employees/[id]/general/_actions';
import { useToast } from '@/lib/ui/hooks';
import { EMPLOYEE_GENERAL_TOASTS } from '@/shared/constants/toast-notifications';
import { type EmployeeGeneralInfoAccess } from '@/api/hris/employees/model/dtos';

type Props = {
  employeeId: CUID;
  partnershipInfo: EmployeePartnershipSchema & { _access: { edit: EmployeeGeneralInfoAccess } };
  company: string;
  isDisabled?: boolean;
};

function Form({
  employeeId,
  partnershipInfo,
  company,
  onSuccess,
}: Props & { onSuccess: () => void }): JSX.Element {
  const { role, employmentType, taxId, bankAccount, holiday, _access } = partnershipInfo;

  const pushToast = useToast();
  const t = useTranslations();
  const tNext = useNextTranslations('employees.generalView');

  const employmentTypesItems = useMemo(
    () => EMPLOYMENT_TYPES.map((item) => ({ ...item, label: tNext(item.label) })),
    [tNext],
  );

  const handleSuccess = () => {
    onSuccess();
    pushToast(EMPLOYEE_GENERAL_TOASTS.PARTNERSHIP_INFO_UPDATE);
  };

  const hasAccessToField = (field: string) => {
    return typeof _access.edit === 'object' ? field in _access.edit : _access.edit;
  };

  return (
    <Section heading={t('employees.generalView.partnership')} id="partnership">
      <FormComponent
        action={updateEmployeePartnershipInfo}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10"
        defaultState={{
          status: 'idle',
          form: {
            employeeId,
            role: role ?? '',
            employmentType: employmentType ?? '',
            taxId: taxId ?? '',
            bankAccount: bankAccount ?? '',
            holiday: `${holiday ?? ''}`,
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <FormControl errors={errors} name="role">
              {(formState) => (
                <TextInput
                  autoFocus
                  defaultValue={form.role}
                  isDisabled={!hasAccessToField('role')}
                  label={t('employees.generalView.role')}
                  {...formState}
                />
              )}
            </FormControl>
            <div className="flex gap-x-4">
              <FormControl errors={errors}>
                {(formState) => (
                  <TextInput
                    isDisabled
                    defaultValue={company}
                    label={t('employees.generalView.company')}
                    {...formState}
                  />
                )}
              </FormControl>
            </div>
            <FormControl errors={errors} name="holiday">
              {(formState) => (
                <TextInput
                  defaultValue={form.holiday}
                  isDisabled={!hasAccessToField('holiday')}
                  label={t('employees.generalView.holiday')}
                  {...formState}
                />
              )}
            </FormControl>
            <div />
            <FormControl errors={errors} name="employmentType">
              {(formState) => (
                <ComboBox
                  defaultSelectedKey={form.employmentType}
                  isDisabled={!hasAccessToField('employmentType')}
                  items={employmentTypesItems}
                  label={t('employees.generalView.employment')}
                  selectionMode="single"
                  {...formState}
                />
              )}
            </FormControl>
            <FormControl errors={errors} name="taxId">
              {(formState) => (
                <TextInput
                  defaultValue={form.taxId}
                  isDisabled={!hasAccessToField('taxId')}
                  label={t('employees.generalView.taxId')}
                  {...formState}
                />
              )}
            </FormControl>
            <div className="col-span-full">
              <FormControl
                errors={errors}
                name="bankAccount"
                translationValues={{
                  smallestValue: 6,
                  biggestValue: 50,
                }}
              >
                {(formState) => (
                  <TextInput
                    defaultValue={form.bankAccount}
                    isDisabled={!hasAccessToField('bankAccount')}
                    label={t('employees.generalView.bankAccount')}
                    {...formState}
                  />
                )}
              </FormControl>
            </div>
            <FormFooter onCancel={onSuccess} />
          </>
        )}
      </FormComponent>
    </Section>
  );
}

export function PartnershipForm({ employeeId, isDisabled, partnershipInfo, company }: Props) {
  const { role, employmentType, taxId, bankAccount, holiday, _access } = partnershipInfo;

  const [isEdit, setIsEdit] = useState(false);
  const t = useTranslations();

  if (isEdit) {
    return (
      <Form
        company={company}
        employeeId={employeeId}
        partnershipInfo={partnershipInfo}
        onSuccess={() => setIsEdit(false)}
      />
    );
  }

  const canEdit =
    typeof _access.edit === 'object'
      ? 'role' in _access.edit ||
        'holiday' in _access.edit ||
        'taxId' in _access.edit ||
        'bankAccount' in _access.edit ||
        'employmentType' in _access.edit
      : _access.edit;

  return (
    <Section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10"
      heading={t('employees.generalView.partnership')}
      id="partnership"
      isEdit={canEdit && !isDisabled}
      onEdit={() => setIsEdit(true)}
    >
      <ContentBlock label={t('employees.generalView.role')}>{parseString(role)}</ContentBlock>
      <ContentBlock label={t('employees.generalView.company')}>{company}</ContentBlock>
      <div className="col-span-full">
        <ContentBlock label={t('employees.generalView.holiday')}>
          {parseString(holiday?.toString() ?? null)}
        </ContentBlock>
      </div>
      <ContentBlock label={t('employees.generalView.employment')}>
        {employmentType ? t(parseString(parseEmploymentTypeToLabel(employmentType))) : '-'}
      </ContentBlock>
      <ContentBlock label={t('employees.generalView.taxId')}>{parseString(taxId)}</ContentBlock>
      <div className="col-span-full">
        <ContentBlock label={t('employees.generalView.bankAccount')}>{parseString(bankAccount)}</ContentBlock>
      </div>
    </Section>
  );
}
