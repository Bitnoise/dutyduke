import { useLocale } from 'next-intl';
import { enUS, pl } from 'date-fns/locale';
export function useDateLocale(defaultLocale?: string) {
  const locale = useLocale();

  const l = defaultLocale ?? locale;

  switch (l) {
    case 'en':
      return enUS;
    case 'pl':
      return pl;
    default:
      return enUS;
  }
}
