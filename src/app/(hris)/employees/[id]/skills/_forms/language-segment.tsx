import { useTranslations as useNextTranslations } from 'next-intl';
import { Button, FormControl, TextInput } from '@/lib/ui';
import { type CUID } from '@/shared';
import { type LanguageErrors } from '@/app/(hris)/employees/[id]/skills/_actions/types';
import { type LanguageSchema } from '../_schemas';

type Props = {
  id: CUID;
  formErrors?: LanguageErrors;
  languageItem: LanguageSchema;
  onRemove: () => void;
};

const fieldsPrefix = 'language';

export function LanguageSegment({ id, formErrors, languageItem, onRemove }: Props): JSX.Element {
  const tNext = useNextTranslations();

  const errors = formErrors ? formErrors[id] : undefined;

  return (
    <>
      <div className="flex gap-x-4">
        <input defaultValue={id} name={`${fieldsPrefix}-id`} type="hidden" />
        <FormControl errors={errors} name="name" prefix={fieldsPrefix}>
          {({ name, isSubmitting, isInvalid, errorMessage }) => (
            <TextInput
              isRequired
              aria-label={tNext('forms.name')}
              defaultValue={languageItem.name}
              errorMessage={errorMessage}
              inputProps={{
                placeholder: tNext('forms.name'),
              }}
              isInvalid={isInvalid}
              isReadOnly={isSubmitting}
              name={name}
            />
          )}
        </FormControl>
        <FormControl errors={errors} name="level" prefix={fieldsPrefix}>
          {({ name, isInvalid, isSubmitting, errorMessage }) => (
            <TextInput
              isRequired
              aria-label={tNext('forms.level')}
              defaultValue={languageItem.level}
              errorMessage={errorMessage}
              inputProps={{
                placeholder: tNext('forms.level'),
              }}
              isInvalid={isInvalid}
              isReadOnly={isSubmitting}
              name={name}
            />
          )}
        </FormControl>
        <FormControl>
          {({ isSubmitting }) => (
            <Button
              aria-label={tNext('ctaLabels.delete')}
              className="mt-0.5 size-8 basis-8"
              icon="trash"
              intent="tertiary"
              isDisabled={isSubmitting}
              type="button"
              onClick={onRemove}
            />
          )}
        </FormControl>
      </div>
    </>
  );
}
