import { type IconProps } from './types';

export function ArrowDown({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M5.39968 13.8997C5.69257 13.6068 6.16744 13.6068 6.46034 13.8997L11.25 18.6893L11.25 3.49999C11.25 3.08577 11.5858 2.74999 12 2.74999C12.4142 2.74999 12.75 3.08577 12.75 3.49999L12.75 18.6893L17.5397 13.8997C17.8326 13.6068 18.3074 13.6068 18.6003 13.8997C18.8932 14.1926 18.8932 14.6674 18.6003 14.9603L12.5303 21.0303C12.3897 21.171 12.1989 21.25 12 21.25C11.8011 21.25 11.6103 21.171 11.4697 21.0303L5.39968 14.9603C5.10678 14.6674 5.10678 14.1926 5.39968 13.8997Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
