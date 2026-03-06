'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { type PropsWithChildren } from 'react';
import { Tag as RATag, type TagProps } from 'react-aria-components';
import { cn } from '@/shared';

const tagStyles = cva(
  'rounded-[1.1875rem] border border-accent bg-white py-px text-center text-accent outline-none data-[selected]:bg-accent data-[selected]:text-white data-[focused]:ring-2 data-[focused]:ring-accent',
  {
    variants: {
      size: {
        sm: 'px-1 text-xs',
        md: 'px-2 text-base',
        lg: 'px-2 text-sm',
      },
    },
  },
);

/**
 * Tag component can only be used inside TagGroup component
 */
export function Tag({
  children,
  size = 'sm',
  className,
  ...other
}: PropsWithChildren<TagProps & VariantProps<typeof tagStyles>>): JSX.Element {
  return (
    <RATag className={cn(tagStyles({ size }), className)} {...other}>
      {children}
    </RATag>
  );
}
