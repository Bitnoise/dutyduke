'use client';
import {
  TagGroup as RATagGroup,
  TagList as RATagList,
  type TagGroupProps as RATagGroupProps,
  type TagListProps,
} from 'react-aria-components';
import { Label } from '@/lib/ui/components';
import { cn } from '@/shared';
import { FieldError } from './field-error';

type Props<T> = Omit<RATagGroupProps, 'children'> &
  Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> & {
    label?: string;
    errorMessage?: string;
    tagListClassName?: string;
  };

export function TagGroup<T extends object>({
  label,
  errorMessage,
  items,
  children,
  selectionMode = 'single',
  renderEmptyState,
  className,
  tagListClassName,
  ...other
}: Props<T>) {
  return (
    <RATagGroup className={cn(className)} selectionMode={selectionMode} {...other}>
      <Label>{label}</Label>
      <RATagList className={cn(tagListClassName)} items={items} renderEmptyState={renderEmptyState}>
        {children}
      </RATagList>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </RATagGroup>
  );
}
