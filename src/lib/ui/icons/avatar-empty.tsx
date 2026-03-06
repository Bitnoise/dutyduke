import { type IconProps } from './types';

export function AvatarEmpty({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11.5" stroke="currentColor" strokeDasharray="2 2" />
    </svg>
  );
}
