import { type HTMLAttributes } from 'react';
import { type Size } from '@/shared';
import { icons, type IconNames } from '@/lib/ui/icons';

type IconProps = HTMLAttributes<HTMLSpanElement> & {
  name: IconNames;
  size?: Size | number;
};

export const iconsSizes: Record<Size, number> = {
  xxs: 14,
  xs: 18,
  sm: 24,
  md: 40,
  lg: 88,
  xl: 92,
  '2xl': 98,
};

export function Icon({ name, size = 'sm', ...rest }: IconProps) {
  const IconComponent = icons[name];
  const iconSize = typeof size === 'number' ? size : iconsSizes[size];

  return (
    <span aria-hidden="true" {...rest}>
      <IconComponent height={iconSize} width={iconSize} />
    </span>
  );
}
