import { type ClassValue } from 'clsx';

export type PropsWithClassName<T = object> = T & {
  className?: ClassValue;
};
