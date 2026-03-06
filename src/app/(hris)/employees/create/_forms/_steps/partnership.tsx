'use client';

import { useTranslations as useNextTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';

import { ComboBox, DateField, FormControl, TextInput } from '@/lib/ui';
import { cn, EMPLOYMENT_TYPES, type Steps } from '@/shared';
import { BANK_ACCOUNT_LENGTH } from '@/shared/constants/bank-account-length';
import { type FormSteps } from '../../_types';
import { employeeCreationAtom, store } from '../../_store';
import { STEPS_NAVIGATION } from './steps';
import { StepButtons } from '.';

export function Partnership({
  errors,
  companyName,
  currentStep,
  handleBackButtonClick,
  handleNextButtonClick,
  dateFormat,
}: FormSteps<Steps> & { companyName: string; dateFormat: string }) {
  const t = useTranslations();
  const tNext = useNextTranslations('createEmployee');
  const data = store.get(employeeCreationAtom);
  const { min, max } = BANK_ACCOUNT_LENGTH;

  const flexClassNames = 'flex flex-col gap-6 sm:flex-row';
  const basisHalfClassNames = 'basis-1/2';

  const employmentTypesItems = useMemo(
    () => EMPLOYMENT_TYPES.map((item) => ({ ...item, label: tNext(item.label) })),
    [tNext],
  );

  const handleChange = (name: string, val: string) => {
    store.set(employeeCreationAtom, (prev) => {
      return { ...prev, [name]: val };
    });
  };

  const goToNextStep = () => {
    handleNextButtonClick();
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className={flexClassNames}>
        <TextInput
          isReadOnly
          className={cn(basisHalfClassNames, 'hidden')}
          defaultValue={companyName}
          label={t('createEmployee.company')}
        />
        <FormControl errors={errors} name="role">
          {(formState) => (
            <TextInput
              className={basisHalfClassNames}
              defaultValue={data.role}
              label={t('createEmployee.role')}
              onChange={(val) => handleChange('role', val)}
              {...formState}
            />
          )}
        </FormControl>
      </div>
      <div className={flexClassNames}>
        <FormControl errors={errors} name="startingDate">
          {(formState) => (
            <DateField
              className={basisHalfClassNames}
              dateFormat={dateFormat}
              defaultValue={data.joinDate}
              label={t('createEmployee.startingDate')}
              onChange={(e) => e && handleChange('joinDate', e.toString())}
              {...formState}
            />
          )}
        </FormControl>
        <FormControl
          errors={errors}
          name="bankAccount"
          translationValues={{
            smallestValue: min,
            biggestValue: max,
          }}
        >
          {(formState) => (
            <TextInput
              className={basisHalfClassNames}
              defaultValue={data.bankAccount}
              label={t('createEmployee.bankAccount')}
              onChange={(val) => handleChange('bankAccount', val)}
              {...formState}
            />
          )}
        </FormControl>
      </div>
      <div className={flexClassNames}>
        <div className={basisHalfClassNames}>
          <FormControl errors={errors} name="employmentType">
            {(formState) => (
              <ComboBox
                defaultSelectedKey={data.employmentType}
                items={employmentTypesItems}
                label={t('createEmployee.employmentType')}
                selectionMode="single"
                onSelectionChange={(key) => handleChange('employmentType', key ? `${key}` : '')}
                {...formState}
              />
            )}
          </FormControl>
        </div>
        <FormControl errors={errors} name="taxId">
          {(formState) => (
            <TextInput
              className={basisHalfClassNames}
              defaultValue={data.taxId}
              label={t('createEmployee.taxId')}
              onChange={(val) => handleChange('taxId', val)}
              {...formState}
            />
          )}
        </FormControl>
      </div>
      <div className={flexClassNames}>
        <div className={basisHalfClassNames}>
          <FormControl errors={errors} name="holiday">
            {(formState) => (
              <TextInput
                className={basisHalfClassNames}
                defaultValue={data.holiday}
                description={t('createEmployee.holidayDescription')}
                label={t('createEmployee.holiday')}
                onChange={(val) => handleChange('holiday', val)}
                {...formState}
              />
            )}
          </FormControl>
        </div>
        <FormControl errors={errors} name="firstYearHoliday">
          {(formState) => (
            <TextInput
              className={basisHalfClassNames}
              defaultValue={data.firstYearHoliday}
              description={t('createEmployee.firstYearHolidayDescription')}
              label={t('createEmployee.firstYearHoliday')}
              onChange={(val) => handleChange('firstYearHoliday', val)}
              {...formState}
            />
          )}
        </FormControl>
      </div>
      <StepButtons<Steps>
        nextStep={STEPS_NAVIGATION[currentStep].next}
        prevStep={STEPS_NAVIGATION[currentStep].prev}
        onBackButtonClick={handleBackButtonClick}
        onNextButtonClick={goToNextStep}
      />
    </div>
  );
}
