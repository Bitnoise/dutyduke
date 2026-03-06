'use client';
import { useState } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { type ApplicationSettingsSchema } from '@/app/(hris)/settings/general/_schemas';
import { Button, ContentBlock, FormControl, Section, Form as FormComponent } from '@/lib/ui';
import {
  getLanguageLabelByKey,
  LANGUAGES,
  parseString,
  DATE_FORMAT_ITEMS,
  getDateFormatLabel,
  type DateFormatKey,
} from '@/shared';
import { ComboBox } from '@/lib/ui/components/combo-box';
import { updateApplicationSettings } from '@/app/(hris)/settings/general/_actions';
import { useToast } from '@/lib/ui/hooks';
import { SETTINGS_TOASTS } from '@/shared/constants/toast-notifications';

type Props = {
  applicationSettings: ApplicationSettingsSchema;
};

function Form({ applicationSettings, onSuccess }: Props & { onSuccess: () => void }) {
  const { language, dateFormat } = applicationSettings;
  const t = useTranslations('settings.generalView');
  const toast = useToast();

  const handleSuccess = () => {
    toast(SETTINGS_TOASTS.UPDATE);
    onSuccess();
  };

  return (
    <Section heading={t('applicationSettings')}>
      <FormComponent
        action={updateApplicationSettings}
        className="grid grid-cols-2 gap-y-6"
        defaultState={{
          status: 'idle',
          form: {
            language,
            dateFormat,
          },
        }}
        onSuccess={handleSuccess}
      >
        {(form, errors) => (
          <>
            <FormControl errors={errors} name="language">
              {(formState) => (
                <ComboBox
                  defaultSelectedKey={form.language}
                  items={LANGUAGES}
                  label={t('language')}
                  selectionMode="single"
                  {...formState}
                />
              )}
            </FormControl>
            <FormControl errors={errors} name="dateFormat">
              {(formState) => (
                <ComboBox
                  defaultSelectedKey={form.dateFormat}
                  items={DATE_FORMAT_ITEMS}
                  label={t('dateFormat')}
                  selectionMode="single"
                  {...formState}
                />
              )}
            </FormControl>
            <div className="col-span-2 flex gap-x-4">
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

export function ApplicationSettingsForm({ applicationSettings }: Props) {
  const { language, dateFormat } = applicationSettings;
  const t = useTranslations('settings.generalView');
  const [isEdit, setIsEdit] = useState(false);

  if (isEdit) {
    return <Form applicationSettings={applicationSettings} onSuccess={() => setIsEdit(false)} />;
  }

  const languageLabel = parseString(getLanguageLabelByKey(language));
  const dateFormatLabel = getDateFormatLabel(dateFormat as DateFormatKey);
  return (
    <Section isEdit heading={t('applicationSettings')} onEdit={() => setIsEdit(true)}>
      <ContentBlock label={t('language')}>{languageLabel}</ContentBlock>
      <ContentBlock label={t('dateFormat')}>{dateFormatLabel}</ContentBlock>
    </Section>
  );
}
