import { type IconProps } from './types';

export function Subtract({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H18C18.4142 11.25 18.75 11.5858 18.75 12C18.75 12.4142 18.4142 12.75 18 12.75H6C5.58579 12.75 5.25 12.4142 5.25 12Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
