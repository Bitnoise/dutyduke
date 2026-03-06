import { type IconProps } from './types';

export function ArrowUp({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M5.39966 10.1003C5.10677 9.80744 5.10677 9.33257 5.39966 9.03968L11.4697 2.96968C11.6103 2.82902 11.8011 2.75001 12 2.75001C12.1989 2.75001 12.3897 2.82902 12.5303 2.96968L18.6003 9.03968C18.8932 9.33257 18.8932 9.80744 18.6003 10.1003C18.3074 10.3932 17.8326 10.3932 17.5397 10.1003L12.75 5.31068L12.75 20.5C12.75 20.9142 12.4142 21.25 12 21.25C11.5858 21.25 11.25 20.9142 11.25 20.5L11.25 5.31066L6.46032 10.1003C6.16743 10.3932 5.69256 10.3932 5.39966 10.1003Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
