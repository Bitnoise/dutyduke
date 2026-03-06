'use client';

import {
  type DatePickerProps as RADatePickerProps,
  DateInput,
  DateSegment,
  type DateValue,
  DatePicker,
  Group,
  Popover,
  Dialog,
  Calendar,
  Heading,
  CalendarGrid,
  CalendarCell,
  I18nProvider,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
} from 'react-aria-components';
import { parseDate as internationalizedParseDate } from '@internationalized/date';
import { useLocale } from 'next-intl';
import { type ReactNode } from 'react';
import { Button, FieldError, Label } from '@/lib/ui';
import { cn, parseDate, type PropsWithClassName } from '@/shared';

type DatePickerProps<T extends DateValue> = Omit<RADatePickerProps<T>, 'defaultValue'> & {
  label?: string | ReactNode;
  defaultValue?: string;
  errorMessage?: string;
  inputClassName?: string;
  dateFormat?: string;
};

/**
 * Maps our date format setting to a locale that displays dates in that format.
 * This is needed because react-aria's DatePicker uses locale-based formatting.
 */
function getLocaleForDateFormat(dateFormat?: string): string {
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      return 'en-GB'; // British English: DD/MM/YYYY
    case 'MM/DD/YYYY':
      return 'en-US'; // American English: MM/DD/YYYY
    case 'YYYY-MM-DD':
      return 'sv-SE'; // Swedish: YYYY-MM-DD (ISO format)
    case 'DD.MM.YYYY':
      return 'de-DE'; // German: DD.MM.YYYY
    default:
      return 'en-GB'; // Default to DD/MM/YYYY
  }
}

export function DateField<T extends DateValue>({
  dateFormat,
  label,
  errorMessage,
  className,
  defaultValue,
  inputClassName,
  ...other
}: PropsWithClassName<DatePickerProps<T>>): JSX.Element {
  const localeFromI18n = useLocale();
  const displayLocale = dateFormat ? getLocaleForDateFormat(dateFormat) : localeFromI18n;

  const parsedDefaultDate = defaultValue
    ? (internationalizedParseDate(parseDate(defaultValue, 'YYYY-MM-DD')) as T)
    : undefined;

  return (
    <I18nProvider locale={displayLocale}>
      <DatePicker
        className={cn('group w-full flex flex-col gap-y-1.5', className)}
        defaultValue={parsedDefaultDate}
        validationBehavior="aria"
        {...other}
      >
        {label && (
          <Label
            className={cn({
              'after:content-["*"]': other.isRequired,
            })}
          >
            {label}
          </Label>
        )}
        <Group className="relative">
          <DateInput
            className={cn(
              'flex h-9 w-full items-center rounded border border-grey bg-super-light-blue px-3.5 text-black transition-colors placeholder:text-dark-grey focus:border-accent disabled:border-super-light-blue disabled:placeholder:text-super-light-blue data-[invalid]:border-warning',
              inputClassName,
            )}
          >
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <Button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black"
            icon="calendar-free"
            intent="ghost"
            size="sm"
          />
        </Group>
        <FieldError className="font-light text-warning">{errorMessage}</FieldError>
        <Popover
          className={({ isEntering, isExiting }) =>
            cn('bg-white', {
              'animate-slide-in': isEntering,
              'animate-slide-out': isExiting,
            })
          }
          placement="bottom right"
        >
          <Dialog className="rounded-lg shadow-xl">
            <Calendar className="px-6 pb-6 pt-4">
              <header className="text-text-light-body flex items-center justify-between text-base">
                <Heading />
                <div className="flex items-center gap-x-3.5">
                  <Button
                    className="size-9 rotate-90"
                    icon="arrow2-down"
                    intent="ghost"
                    size="sm"
                    slot="previous"
                  />
                  <Button
                    className="size-9 -rotate-90"
                    icon="arrow2-down"
                    intent="ghost"
                    size="sm"
                    slot="next"
                  />
                </div>
              </header>
              <CalendarGrid className="w-full">
                <CalendarGridHeader>
                  {(day) => (
                    <CalendarHeaderCell className="text-text-helper size-9 text-xs font-light">
                      {day}
                    </CalendarHeaderCell>
                  )}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => {
                    return (
                      <CalendarCell
                        className="text-text-light-body flex size-9 items-center justify-center rounded-full text-sm outline-none data-[selected]:bg-blue-100 data-[unavailable]:text-red-900 data-[unavailable]:line-through data-[disabled]:opacity-50 data-[focused]:ring data-[focused]:ring-blue-800"
                        date={date}
                      />
                    );
                  }}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </DatePicker>
    </I18nProvider>
  );
}
