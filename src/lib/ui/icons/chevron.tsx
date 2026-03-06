import { type IconProps } from './types';

export function Chevron({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 16 16" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.02449 8.00004L3.96167 4.93338L4.43347 4.46158L7.97194 8.00004L4.43347 11.5385L3.96167 11.0667L7.02449 8.00004ZM11.0912 8.00004L8.02834 4.93338L8.50014 4.46158L12.0386 8.00004L8.50014 11.5385L8.02834 11.0667L11.0912 8.00004Z"
        fill="currentColor"
      />
    </svg>
  );
}
