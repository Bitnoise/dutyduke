'use client';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Checkbox } from 'react-aria-components';
import { cn, type PropsWithClassName, SEARCH_PARAM_KEYS } from '@/shared';
import { useQueryParams } from '@/lib/ui/hooks';
import { Icon } from '@/lib/ui/components/icon';

const filterTagStyles = cva(
  'flex h-6 w-fit cursor-pointer items-center gap-x-2 rounded border border-gray-300 bg-white pl-1 pr-2 text-sm transition-colors',
  {
    variants: {
      variant: {
        darkRed: 'text-red-900 hover:bg-red-100 focus:bg-red-100',
        lightGreen: 'text-green-300 hover:bg-green-50 focus:bg-green-50',
        green: 'text-green-800 hover:bg-green-100 focus:bg-green-100',
        blue: 'text-blue-800 hover:bg-blue-100 focus:bg-blue-100',
        orange: 'text-orange-900 hover:bg-orange-100 focus:bg-orange-100',
        gray: 'text-gray-600 hover:bg-gray-100 focus:bg-gray-100',
      },
    },
    defaultVariants: {
      variant: 'green',
    },
  },
);

const filterTagCheckboxStyles = cva(
  'flex size-4 items-center justify-center rounded-sm border bg-white transition-colors group-data-[focused]:ring',
  {
    variants: {
      variant: {
        darkRed: 'border-red-900 group-data-[focused]:ring-red-900',
        lightGreen: 'border-green-300 group-data-[focused]:ring-green-300',
        green: 'border-green-800 group-data-[focused]:ring-green-800',
        blue: 'border-blue-800 group-data-[focused]:ring-blue-800',
        orange: 'border-orange-900 group-data-[focused]:ring-orange-900',
        gray: 'border-gray-600 group-data-[focused]:ring-gray-600',
      },
      isSelected: {
        true: '',
      },
    },
    compoundVariants: [
      {
        variant: 'darkRed',
        isSelected: true,
        className: 'border-red-900 bg-red-900',
      },
      {
        variant: 'lightGreen',
        isSelected: true,
        className: 'border-green-300 bg-green-300',
      },
      {
        variant: 'green',
        isSelected: true,
        className: 'border-green-800 bg-green-800',
      },
      {
        variant: 'blue',
        isSelected: true,
        className: 'border-blue-800 bg-blue-800',
      },
      {
        variant: 'orange',
        isSelected: true,
        className: 'border-orange-900 bg-orange-900',
      },
      {
        variant: 'gray',
        isSelected: true,
        className: 'border-gray-600 bg-gray-600',
      },
    ],
    defaultVariants: {
      variant: 'green',
      isSelected: false,
    },
  },
);

type Props = {
  searchParamKey: keyof typeof SEARCH_PARAM_KEYS;
  value: string;
} & VariantProps<typeof filterTagStyles>;

export function FilterTag({
  children,
  searchParamKey,
  value,
  className,
  variant = 'green',
}: PropsWithClassName<PropsWithChildren<Props>>) {
  const parsedSerachParamKey = SEARCH_PARAM_KEYS[searchParamKey];

  const { searchParams, setMultipleSearchParams } = useQueryParams();

  const params = searchParams.get(parsedSerachParamKey)?.split(',').filter(Boolean).includes(value);

  const [isSelected, setIsSelected] = useState(() => !!params);

  const handleChange = (checked: boolean) => {
    const activeFilters = searchParams.get(parsedSerachParamKey)?.split(',').filter(Boolean) ?? [];

    const newFilterValue = checked
      ? [...activeFilters, value].join(',')
      : activeFilters.filter((filter) => filter !== value).join(',');

    setMultipleSearchParams([
      { key: parsedSerachParamKey, value: newFilterValue },
      { key: SEARCH_PARAM_KEYS.PAGE, value: '1' },
    ]);

    setIsSelected(checked);
  };

  useEffect(() => {
    setIsSelected(!!params);
  }, [params]);

  return (
    <div className={cn(filterTagStyles({ variant }), className)}>
      <Checkbox className="group flex items-center gap-x-2" isSelected={isSelected} onChange={handleChange}>
        <div className={cn(filterTagCheckboxStyles({ variant, isSelected }))}>
          <Icon
            className={cn('text-white transition-opacity opacity-0', {
              'opacity-100': isSelected,
            })}
            name="ok"
            size="xs"
          />
        </div>
        {children}
      </Checkbox>
    </div>
  );
}
