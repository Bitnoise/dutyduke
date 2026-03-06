import Link from 'next/link';
import { type ReactNode } from 'react';
import { useTranslations } from '@/shared/service/locale/use-translations';
import { Icon } from '@/lib/ui';

type Props = {
  heading: string | ReactNode;
  message: string | ReactNode;
  goBackLink: string;
};

export function ErrorLayout({ heading, message, goBackLink }: Props) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center gap-y-5">
      <Icon className="text-warning" name="warning-full" size="2xl" />
      <h2 className="text-center text-lg font-bold md:text-4xl">{heading}</h2>
      <p>{message}</p>
      <Link
        className="flex items-center justify-center gap-x-1.5 border-b border-b-black text-center"
        href={goBackLink}
      >
        <Icon name="arrow-left" size="xs" />
        {t('ctaLabels.goBack')}
      </Link>
    </div>
  );
}
