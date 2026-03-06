import { type IconProps } from './types';

export function TickCircleFull({ height, width }: IconProps): JSX.Element {
  return (
    <svg fill="none" height={height} viewBox="0 0 24 24" width={width} xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M1.25 12C1.25 6.08579 6.08579 1.25 12 1.25C17.9142 1.25 22.75 6.08579 22.75 12C22.75 17.9142 17.9142 22.75 12 22.75C6.08579 22.75 1.25 17.9142 1.25 12ZM16.9565 9.87771C17.3474 9.48753 17.3479 8.85437 16.9577 8.4635C16.5676 8.07263 15.9344 8.07207 15.5435 8.46225L10.5806 13.4164L8.45711 11.2929C8.06658 10.9024 7.43342 10.9024 7.04289 11.2929C6.65237 11.6834 6.65237 12.3166 7.04289 12.7071L9.87289 15.5371C10.2632 15.9274 10.8959 15.9276 11.2865 15.5377L16.9565 9.87771Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
