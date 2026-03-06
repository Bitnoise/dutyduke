'use client';

import { Button, ComboBox as RAComboBox, Input, ListBox, ListBoxItem, Popover } from 'react-aria-components';
import { useRef } from 'react';
import { cn, type PropsWithClassName } from '@/shared';
import { useElementBoundingClientRect } from '@/lib/ui/hooks';
import { FieldError } from '@/lib/ui';
import { Icon } from '../icon';
import { Label } from '../label';
import { type ComboBoxProps } from './types';

export function ComboBox<T extends object>({
  label,
  className,
  items,
  inputProps,
  errorMessage,
  validationBehavior = 'aria',
  isRequired,
  ...other
}: PropsWithClassName<ComboBoxProps<T>>): JSX.Element {
  const { isInvalid } = other;

  const inputRef = useRef<HTMLInputElement>(null);
  const inputBoundingClientRect = useElementBoundingClientRect(inputRef);

  return (
    <RAComboBox
      className={cn('group w-full', className)}
      menuTrigger="focus"
      validationBehavior={validationBehavior}
      {...other}
    >
      <div className="flex flex-col gap-y-1.5">
        {label && (
          <Label
            className={cn({
              'after:content-["*"]': isRequired,
            })}
          >
            {label}
          </Label>
        )}
        <div
          className={cn('flex h-9 w-full items-center rounded border border-grey', {
            'border-warning': isInvalid,
          })}
        >
          <Input
            className="size-full rounded-l bg-super-light-blue pl-3.5 outline-none"
            ref={inputRef}
            {...inputProps}
          />
          <Button className="h-8 rounded-r bg-super-light-blue px-1.5">
            <Icon
              className="block text-black transition-transform group-data-[open]:rotate-180"
              name="arrow2-down"
            />
          </Button>
        </div>
      </div>
      <FieldError>{errorMessage}</FieldError>
      <Popover
        className="bg-white data-[entering]:animate-slide-in data-[exiting]:animate-slide-out"
        style={{
          minWidth: inputBoundingClientRect?.width,
        }}
      >
        <ListBox className="max-h-96 overflow-y-auto rounded border border-grey py-3.5 transition-colors">
          {items.map((item) => (
            <ListBoxItem
              key={item.key}
              className="flex bg-white px-2 py-1.5 hover:bg-hover data-[focused]:bg-hover"
              id={item.key}
              textValue={'textValue' in item ? item.textValue : item.label}
            >
              {item.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </RAComboBox>
  );
}
