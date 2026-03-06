import { type IconProps } from './types';

export function CircleNeutral({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 16 16" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8.00016 0.833252C4.05735 0.833252 0.833496 4.05711 0.833496 7.99992C0.833496 11.9427 4.05735 15.1666 8.00016 15.1666C11.943 15.1666 15.1668 11.9427 15.1668 7.99992C15.1668 4.05711 11.943 0.833252 8.00016 0.833252ZM11.3335 8.66659C11.7017 8.66659 12.0002 8.36811 12.0002 7.99992C12.0002 7.63173 11.7017 7.33325 11.3335 7.33325L4.66683 7.33325C4.29864 7.33325 4.00016 7.63173 4.00016 7.99992C4.00016 8.36811 4.29864 8.66658 4.66683 8.66658L11.3335 8.66659Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
