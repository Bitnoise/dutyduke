import { type IconProps } from './types';

export function Arrow2Down({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M18.5303 8.46967C18.8232 8.76256 18.8232 9.23744 18.5303 9.53033L12.5303 15.5303C12.3897 15.671 12.1989 15.75 12 15.75C11.8011 15.75 11.6103 15.671 11.4697 15.5303L5.46967 9.53033C5.17678 9.23744 5.17678 8.76256 5.46967 8.46967C5.76256 8.17678 6.23744 8.17678 6.53033 8.46967L12 13.9393L17.4697 8.46967C17.7626 8.17678 18.2374 8.17678 18.5303 8.46967Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
