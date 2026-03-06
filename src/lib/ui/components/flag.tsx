import { cva, type VariantProps } from 'class-variance-authority';
import { type PropsWithChildren } from 'react';
import { cn, type PropsWithClassName } from '@/shared';
import { Icon } from '@/lib/ui/components/icon';
import { type IconNames } from '@/lib/ui/icons';

const flagStyles = cva('flex h-5 w-fit items-center gap-x-1 rounded-full p-1 text-xs', {
  variants: {
    intent: {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-orange-100 text-orange-900',
      info: 'bg-blue-100 text-blue-800',
      'info-grey': 'bg-gray-100 text-gray-600',
      danger: 'bg-red-100 text-red-900',
    },
  },
});

type Props = VariantProps<typeof flagStyles> & {
  icon?: IconNames;
};

const defaultIcons: Record<string, IconNames> = {
  success: 'circle-tick',
  warning: 'circle-neutral',
  info: 'circle-clock',
  danger: 'circle-close',
  'info-grey': 'circle-close',
};

export function Flag({
  intent = 'info',
  className,
  children,
  icon,
}: PropsWithChildren<PropsWithClassName<Props>>): JSX.Element {
  return (
    <div className={cn(flagStyles({ intent }), className)}>
      <Icon name={icon ?? defaultIcons[intent!]} size={16} />
      {children}
    </div>
  );
}
