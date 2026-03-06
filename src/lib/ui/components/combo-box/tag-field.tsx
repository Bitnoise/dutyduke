'use client';

import { Button, ComboBox as RAComboBox, Input, ListBox, ListBoxItem, Popover } from 'react-aria-components';
import { type Key, useState, useMemo, useRef, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import { cn, type PropsWithClassName } from '@/shared';
import { useElementBoundingClientRect } from '@/lib/ui/hooks';
import { FieldError } from '@/lib/ui';
import { Icon } from '../icon';
import { Label } from '../label';
import { type TagFieldProps } from './types';
import { Tag } from './tag';

export function TagField<T extends object>({
  label,
  className,
  items,
  name,
  defaultSelectedTags = [],
  onTagSelection,
  defaultInputValue,
  inputProps,
  validationBehavior = 'aria',
  errorMessage,
  ...other
}: PropsWithClassName<TagFieldProps<T>>): JSX.Element {
  const { isInvalid } = other;

  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<Key[]>(defaultSelectedTags);
  const [inputValue, setInputValue] = useState(() => defaultInputValue ?? '');
  const inputBoundingClientRect = useElementBoundingClientRect(inputRef);

  const addTag = (key: Key | null) => {
    if (!key) return;

    const updatedTags = [...tags, key];

    flushSync(() => {
      setTags(updatedTags);
      onTagSelection?.(updatedTags);
    });

    setInputValue('');
  };

  const removeTag = (key?: Key) => {
    let updatedTags = tags;

    if (!key) {
      updatedTags = tags.slice(0, -1);
    } else {
      updatedTags = tags.filter((tag) => tag !== key);
    }

    setTags(updatedTags);
    onTagSelection?.(updatedTags);
  };

  const handleBackspaceClick = (event: KeyboardEvent) => {
    if (event.key !== 'Backspace' || inputValue) return;

    removeTag();
  };

  const listBoxItems = useMemo(
    () =>
      items.map((item) => {
        const isSelected = tags.some((tag) => tag === item.key);
        return (
          <ListBoxItem
            key={item.key}
            className={cn(
              'px-2 flex gap-x-1 py-1.5 active:hover:bg-hover data-[focused]:bg-hover data-[disabled]:opacity-50',
              {
                'bg-super-light-blue': isSelected,
              },
            )}
            id={String(item.key)}
            isDisabled={isSelected}
            textValue={
              'textValue' in item
                ? item.textValue
                : typeof item.label === 'string'
                  ? item.label
                  : String(item.key)
            }
          >
            {isSelected && <Icon name="ok" />}
            {item.label}
          </ListBoxItem>
        );
      }),
    [items, tags],
  );

  return (
    <RAComboBox
      className={cn('group w-full', className)}
      inputValue={inputValue}
      menuTrigger="focus"
      validationBehavior={validationBehavior}
      onInputChange={setInputValue}
      onKeyDown={handleBackspaceClick}
      onSelectionChange={addTag}
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
      <input readOnly name={name} type="hidden" value={tags.join(',')} />
      <div
        className={cn('flex h-9 w-full rounded border border-grey', {
          'border-warning': isInvalid,
        })}
      >
        <Input
          className="w-full rounded-l bg-super-light-blue pl-3.5 outline-none"
          ref={inputRef}
          {...inputProps}
        />
        <Button className="rounded-r bg-super-light-blue px-1.5">
          <Icon
            className="block text-black transition-transform group-data-[open]:rotate-180"
            name="arrow2-down"
          />
        </Button>
      </div>
      {<FieldError>{errorMessage}</FieldError>}
      <div
        className={cn('flex shrink-0 flex-wrap gap-x-2.5 gap-y-1.5 py-1.5', {
          hidden: !tags.length,
        })}
      >
        {tags.map((tag) => {
          const item = items.find((item) => item.key === tag);

          if (!item) return null;

          const itemTextValue =
            'textValue' in item
              ? item.textValue
              : typeof item.label === 'string'
                ? item.label
                : String(item.key);

          return (
            <Tag key={tag} aria-label={itemTextValue} onClick={() => removeTag(tag)}>
              {item.label}
            </Tag>
          );
        })}
      </div>
      <Popover
        className="block max-h-96 data-[entering]:animate-slide-in data-[exiting]:animate-slide-out"
        style={{
          minWidth: inputBoundingClientRect?.width,
        }}
      >
        <ListBox className="max-h-96 overflow-y-auto overflow-x-hidden rounded border border-grey bg-white py-3.5 transition-colors">
          {listBoxItems}
        </ListBox>
      </Popover>
    </RAComboBox>
  );
}
