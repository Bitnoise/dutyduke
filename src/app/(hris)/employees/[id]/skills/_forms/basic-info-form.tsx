'use client';

import { useState } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import {
  ContentBlock,
  List,
  Section,
  Form as FormComponent,
  FormControl,
  TextArea,
  ComboBox,
  SegmentLabel,
  Button,
  FormFooter,
} from '@/lib/ui';
import {
  type LanguageSchema,
  type ResourceSkillSchema,
  type SkillSchema,
} from '@/app/(hris)/employees/[id]/skills/_schemas';
import { type CUID, type Nullable, parseString } from '@/shared';
import { updateBasicInfo } from '@/app/(hris)/employees/[id]/skills/_actions';
import { useDynamicEntries, useToast } from '@/lib/ui/hooks';
import { LanguageSegment } from '@/app/(hris)/employees/[id]/skills/_forms';
import { SKILLS_TOASTS } from '@/shared/constants/toast-notifications';

type Props = {
  basicInfo: {
    description: Nullable<string>;
    primarySkills: SkillSchema[];
    secondarySkills: SkillSchema[];
    languages: LanguageSchema[];
  };
  isDisabled?: boolean;
  employeeId: CUID;
  resourceSkills: ResourceSkillSchema[];
};

const parseSkills = (skills: SkillSchema[]) => skills.map(({ name }) => name).join(', ');

function Form({
  employeeId,
  basicInfo,
  resourceSkills,
  onSuccess,
}: Props & { onSuccess: () => void }): JSX.Element {
  const { description, primarySkills, secondarySkills, languages } = basicInfo;

  const t = useTranslations('employees.skillsView');
  const tNext = useNextTranslations('employees.skillsView');
  const toast = useToast();

  const [languagesEntries, addLanguageEntry, removeLanguageEntry] =
    useDynamicEntries<LanguageSchema>(languages);

  const addNewLanguageEntry = () => {
    addLanguageEntry({
      id: `temp--${createId()}`,
      name: '',
      level: '',
    });
  };

  const resourceSkillItems = resourceSkills.map((skill) => ({ label: skill.name, key: skill.id }));

  const handleSuccess = () => {
    toast(SKILLS_TOASTS.UPDATE_SKILLS);
    onSuccess();
  };

  return (
    <Section heading={t('basicInfo')}>
      <FormComponent
        focusInputOnError
        action={updateBasicInfo}
        className="grid gap-x-5 gap-y-6 sm:grid-cols-2"
        defaultState={{
          status: 'idle',
          form: {
            employeeId,
            description: description ?? '',
            languages: languagesEntries,
            primarySkills: parseSkills(basicInfo.primarySkills),
            secondarySkills: parseSkills(basicInfo.primarySkills),
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <div className="col-span-full hidden">
              <FormControl name="description">
                {(formState) => (
                  <TextArea
                    autoFocus
                    label={t('description')}
                    {...formState}
                    defaultValue={form.description}
                  />
                )}
              </FormControl>
            </div>
            <FormControl name="primarySkills">
              {(formState) => (
                <ComboBox
                  {...formState}
                  allowsCustomValue
                  defaultSelectedTags={primarySkills.map((skill) => skill.skillId)}
                  inputProps={{
                    placeholder: tNext('primarySkills'),
                  }}
                  items={resourceSkillItems}
                  label={t('primarySkills')}
                  selectionMode="multiple"
                />
              )}
            </FormControl>
            <FormControl name="secondarySkills">
              {(formState) => (
                <ComboBox
                  {...formState}
                  allowsCustomValue
                  defaultSelectedTags={secondarySkills.map((skill) => skill.skillId)}
                  inputProps={{
                    placeholder: tNext('secondarySkills'),
                  }}
                  items={resourceSkillItems}
                  label={t('secondarySkills')}
                  selectionMode="multiple"
                />
              )}
            </FormControl>
            <fieldset className="col-span-full block xl:col-span-1">
              <SegmentLabel>{t('languages')}</SegmentLabel>
              <div className="flex flex-col gap-y-4">
                {languagesEntries.map((language, index) => (
                  <LanguageSegment
                    key={language.id}
                    formErrors={errors?.languages}
                    id={language.id}
                    languageItem={language}
                    onRemove={() => removeLanguageEntry(index)}
                  />
                ))}
                <Button
                  className="self-end"
                  icon="add"
                  intent="tertiary"
                  type="button"
                  onClick={addNewLanguageEntry}
                >
                  {t('addLanguage')}
                </Button>
              </div>
            </fieldset>
            <div />
            <FormFooter onCancel={onSuccess} />
          </>
        )}
      </FormComponent>
    </Section>
  );
}

export function BasicInfoForm(props: Props): JSX.Element {
  const { description, primarySkills, secondarySkills, languages } = props.basicInfo;

  const t = useTranslations('employees.skillsView');
  const [isEdit, setIsEdit] = useState(false);

  if (isEdit) {
    return <Form {...props} onSuccess={() => setIsEdit(false)} />;
  }

  return (
    <Section
      className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2"
      heading={t('basicInfo')}
      isEdit={!props.isDisabled}
      onEdit={() => setIsEdit(true)}
    >
      <div className="col-span-full hidden">
        <ContentBlock label={t('description')}>{parseString(description)}</ContentBlock>
      </div>
      <ContentBlock label={t('primarySkills')}>{parseString(parseSkills(primarySkills))}</ContentBlock>
      <ContentBlock label={t('secondarySkills')}>{parseString(parseSkills(secondarySkills))}</ContentBlock>
      <ContentBlock label={t('languages')}>
        <List emptyText="-" items={languages}>
          {(language) => (
            <p className="grid grid-cols-2">
              <span>{language.name}</span>
              <span>{language.level}</span>
            </p>
          )}
        </List>
      </ContentBlock>
    </Section>
  );
}
