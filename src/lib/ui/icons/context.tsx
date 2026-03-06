import { type IconProps } from './types';

export function Context({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M6 12C6 13.6569 4.65685 15 3 15C1.34315 15 0 13.6569 0 12C0 10.3431 1.34315 9 3 9C4.65685 9 6 10.3431 6 12ZM4.5 12C4.5 12.8284 3.82843 13.5 3 13.5C2.17157 13.5 1.5 12.8284 1.5 12C1.5 11.1716 2.17157 10.5 3 10.5C3.82843 10.5 4.5 11.1716 4.5 12Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15ZM12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9C19.3431 9 18 10.3431 18 12C18 13.6569 19.3431 15 21 15ZM21 13.5C21.8284 13.5 22.5 12.8284 22.5 12C22.5 11.1716 21.8284 10.5 21 10.5C20.1716 10.5 19.5 11.1716 19.5 12C19.5 12.8284 20.1716 13.5 21 13.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
