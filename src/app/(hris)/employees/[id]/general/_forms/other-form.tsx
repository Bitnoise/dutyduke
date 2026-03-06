'use client';

import { useState } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type EmployeeOtherSchema } from '@/app/(hris)/employees/[id]/general/_schemas';
import {
  Button,
  ContentBlock,
  DateField,
  FormControl,
  PhotosList,
  Section,
  SegmentLabel,
  TextInput,
  Form as FormComponent,
  FormFooter,
} from '@/lib/ui';
import { cn, parseDate, parseString, type WithAccess, type CUID } from '@/shared';
import { updateEmployeeOtherInfo } from '@/app/(hris)/employees/[id]/general/_actions';
import { useDynamicEntries, useToast } from '@/lib/ui/hooks';
import { EMPLOYEE_GENERAL_TOASTS } from '@/shared/constants/toast-notifications';
import { type EmployeeGeneralInfoAccess } from '@/api/hris/employees/model/dtos';
import { type Photo } from '@/lib/ui/components/photos-list/types';

type Props = {
  dateFormat: string;
  otherInfo: WithAccess<EmployeeOtherSchema, { edit: EmployeeGeneralInfoAccess }>;
  photos: Photo[];
  employeeId: CUID;
  isDisabled?: boolean;
};

function Form({
  employeeId,
  otherInfo,
  onSuccess,
  photos,
  dateFormat,
}: Props & { onSuccess: () => void }): JSX.Element {
  const t = useTranslations();
  const tNext = useNextTranslations();
  const toast = useToast();

  const [children, addChildEntry, removeChildEntry] = useDynamicEntries(
    otherInfo.children.map((child) => ({
      id: child.id,
      name: child.name,
      birthDate: child.birthDate.toString(),
    })),
  );

  const addChild = () => {
    addChildEntry({ id: createId(), name: '', birthDate: '' });
  };

  const handleSuccess = () => {
    toast(EMPLOYEE_GENERAL_TOASTS.OTHER_INFO_UPDATE);
    onSuccess();
  };

  const hasAccessToField = (field: string) => {
    return typeof otherInfo._access.edit === 'object'
      ? field in otherInfo._access.edit
      : otherInfo._access.edit;
  };

  return (
    <>
      <Section heading={t('employees.generalView.other')} id="other">
        <FormComponent
          focusInputOnError
          action={updateEmployeeOtherInfo}
          className="grid grid-cols-1 gap-6 md:gap-y-10 lg:grid-cols-2"
          defaultState={{
            status: 'idle',
            form: {
              employeeId,
              hobbies: otherInfo.hobbies.join(', '),
              children,
            },
          }}
          onSuccess={handleSuccess}
        >
          {(form, errors) => (
            <>
              <FormControl name="hobbies">
                {(formState) => (
                  <TextInput
                    autoFocus
                    defaultValue={form.hobbies}
                    isDisabled={!hasAccessToField('hobbies')}
                    label={t('employees.generalView.hobby')}
                    {...formState}
                  />
                )}
              </FormControl>
              <div>
                <SegmentLabel as="heading-small">{t('employees.generalView.children')}</SegmentLabel>
                <div className="flex flex-col gap-y-4">
                  {children.map(({ id, name, birthDate }, index) => (
                    <div key={id} className="flex gap-x-2.5">
                      <input defaultValue={id} name="child-id" type="hidden" />
                      <FormControl errors={errors?.children?.[id]} name="name" prefix={`child-${id}`}>
                        {(formState) => (
                          <TextInput
                            isDisabled={!hasAccessToField('children')}
                            {...formState}
                            aria-label={tNext('employees.generalView.childName')}
                            className="flex-1"
                            defaultValue={name}
                          />
                        )}
                      </FormControl>
                      <FormControl errors={errors?.children?.[id]} name="birthDate" prefix={`child-${id}`}>
                        {(formState) => (
                          <DateField
                            {...formState}
                            aria-label={tNext('employees.generalView.childBirthDate')}
                            className="flex-1"
                            dateFormat={dateFormat}
                            defaultValue={birthDate}
                            isDisabled={!hasAccessToField('children')}
                          />
                        )}
                      </FormControl>
                      {hasAccessToField('children') && (
                        <FormControl>
                          {({ isSubmitting }) => (
                            <Button
                              className="mt-1"
                              icon="trash"
                              intent="tertiary"
                              isDisabled={isSubmitting}
                              onClick={() => removeChildEntry(index)}
                            />
                          )}
                        </FormControl>
                      )}
                    </div>
                  ))}
                </div>
                {hasAccessToField('children') && (
                  <Button
                    className={cn({
                      'mt-4': !!children.length,
                    })}
                    icon="add"
                    intent="ghost"
                    onClick={addChild}
                  >
                    {t('employees.generalView.addChild')}
                  </Button>
                )}
              </div>
              <ContentBlock label={t('employees.generalView.photos')}>
                <PhotosList isEditable={hasAccessToField('photos')} items={photos} />
              </ContentBlock>
              <div />
              <FormFooter onCancel={onSuccess} />
            </>
          )}
        </FormComponent>
      </Section>
    </>
  );
}

export function OtherForm({ otherInfo, isDisabled, employeeId, photos, dateFormat }: Props): JSX.Element {
  const { hobbies, children, _access } = otherInfo;

  const t = useTranslations();
  const [isEdit, setIsEdit] = useState(false);

  if (isEdit) {
    return (
      <Form
        dateFormat={dateFormat}
        employeeId={employeeId}
        otherInfo={otherInfo}
        photos={photos}
        onSuccess={() => setIsEdit(false)}
      />
    );
  }

  const canEdit =
    typeof _access.edit === 'object'
      ? 'hobbies' in _access.edit || 'children' in _access.edit || 'photos' in _access.edit
      : _access.edit;

  return (
    <Section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10"
      heading={t('employees.generalView.other')}
      id="other"
      isEdit={canEdit && !isDisabled}
      onEdit={() => setIsEdit(true)}
    >
      <ContentBlock label={t('employees.generalView.hobby')}>
        {parseString(hobbies.map((hobby) => `#${hobby}`).join(', '))}
      </ContentBlock>

      <ContentBlock label={t('employees.generalView.children')}>
        {children.length > 0 ? (
          <ul>
            {children.map(({ id, name, birthDate }) => (
              <li key={id} className="flex gap-x-8">
                <p className="basis-24">
                  <span className="sr-only">{t('employees.generalView.birthdate')}</span>
                  {parseString(parseDate(birthDate, dateFormat))}
                </p>
                <p>{name}</p>
              </li>
            ))}
          </ul>
        ) : (
          '-'
        )}
      </ContentBlock>
      <ContentBlock label={t('employees.generalView.photos')}>
        <PhotosList key={otherInfo.avatarId} items={photos} />
      </ContentBlock>
    </Section>
  );
}
