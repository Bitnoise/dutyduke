import { useTranslations as useNextTranslations } from 'next-intl';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { cn, type PropsWithClassName } from '@/shared';

type Props = {
  items: { label: string; className: string }[];
};

export function Legend({ items, className }: PropsWithClassName<Props>) {
  const t = useTranslations('legend');
  const tNext = useNextTranslations('legend');

  return (
    <ul className={cn('flex gap-2 sm:flex-row flex-wrap', className)}>
      {items.map(({ label, className }) => (
        <li
          key={tNext(label)}
          className={cn('flex h-5 w-fit items-center gap-x-1 rounded-full p-1 text-xs px-1.5', className)}
        >
          {t(label)}
        </li>
      ))}
    </ul>
  );
}
