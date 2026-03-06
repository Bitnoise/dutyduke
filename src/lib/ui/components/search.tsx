'use client';

import { SearchField, Input, type SearchFieldProps, type InputProps } from 'react-aria-components';
import { useRef } from 'react';
import { cn, type PropsWithClassName } from '@/shared';
import { useQueryParams } from '../hooks';
import { Label } from './label';
import { Icon } from './icon';

type SearchInputProps = SearchFieldProps & {
  label?: string;
  inputProps?: InputProps;
  placeholder?: string;
};

export function SearchInput({
  label,
  className,
  inputProps,
  placeholder,
  ...other
}: PropsWithClassName<SearchInputProps>): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchParams, handleSearch } = useQueryParams();

  return (
    <SearchField
      className={cn('group w-full', className)}
      defaultValue={decodeURIComponent(searchParams.get('search') ?? '')}
      {...other}
    >
      {label && <Label>{label}</Label>}
      <div className="flex w-full content-center items-center rounded border border-grey bg-super-light-blue focus:border-accent">
        <Input
          className="h-9 w-full rounded bg-super-light-blue px-3 py-2 text-black placeholder:text-dark-grey disabled:placeholder:text-super-light-blue"
          placeholder={placeholder}
          ref={inputRef}
          {...inputProps}
          onChange={handleSearch}
        />
        <Icon className="flex px-2" name="search-normal" />
      </div>
    </SearchField>
  );
}
