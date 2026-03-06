'use client';

import { type CheckboxProps, Checkbox as RACheckbox } from 'react-aria-components';
import { cn, type PropsWithClassName } from '@/shared';
import { Icon } from './icon';

export function Checkbox({
  children,
  className,
  validationBehavior = 'aria',
  ...other
}: PropsWithClassName<CheckboxProps>): JSX.Element {
  return (
    <RACheckbox
      className={cn('group transition-colors', className)}
      validationBehavior={validationBehavior}
      {...other}
    >
      {({ isIndeterminate }) => (
        <div className="flex cursor-pointer items-start gap-x-4 text-sm group-data-[disabled=true]:text-light-grey">
          <span className="mt-px flex size-4 items-center justify-center rounded border border-dark-grey bg-white p-2 text-white transition-colors hover:border-accent group-data-[disabled=true]:border-light-grey group-data-[invalid=true]:border-warning group-data-[disabled=true]:bg-disabled-light-grey group-data-[indeterminate=true]:bg-accent group-data-[selected=true]:bg-accent group-data-[disabled]:text-disabled-light-grey group-data-[focused]:ring-1 group-data-[focused]:ring-accent">
            {isIndeterminate ? <Icon name="subtract" size="xs" /> : <Icon name="ok" size="xs" />}
          </span>
          <>{children}</>
        </div>
      )}
    </RACheckbox>
  );
}
