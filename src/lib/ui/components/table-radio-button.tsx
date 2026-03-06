'use client';

import { type CheckboxProps, Checkbox as RACheckbox } from 'react-aria-components';
import { cn, type PropsWithClassName } from '@/shared';

export function TableRadioButton({
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
      <div className="flex cursor-pointer items-start gap-x-2 group-data-[disabled=true]:text-light-grey">
        <span className="flex size-[1.125rem] items-center justify-center rounded-full ring-1 ring-inset ring-dark-grey group-data-[invalid]:ring-2 group-data-[selected]:ring-2 group-data-[focused]:ring-accent group-data-[invalid]:ring-warning group-data-[selected]:ring-accent">
          <span className="size-0 rounded-full bg-accent transition-all group-data-[selected]:size-2.5"></span>
        </span>
      </div>
    </RACheckbox>
  );
}
